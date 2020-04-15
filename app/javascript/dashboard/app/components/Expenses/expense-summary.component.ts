import { OnInit, Input, Output, Component, EventEmitter } from '@angular/core';

import { PlanService } from './../../services/plans.service';
import { Utils, DATE_FORMATS } from './../../services/utils.service';
import { Currency } from './../../services/currency';
import templateStr from './expense-summary.component.html';
import './expense-summary.component.scss';

@Component({
	selector: 'app-expense-summary',
	template: templateStr,
})
export class ExpenseSummary implements OnInit {
	@Input() cards;
	@Input() payees;
	@Input() data;
	@Output() filterUpdate: EventEmitter<any> = new EventEmitter();
	@Output() closeFilterView: EventEmitter<any> = new EventEmitter();

	public cardsSelected: string[] = [];
	public payeesSelected: string[] = [];
	public activePlans: any;
	public payeeBreakdown: any = [];
	public cardBreakdown: any = [];
	public overallBreakdown: any = [];
	public payeeTotals: any[] = [];
	public cardTotals: any[] = [];
	public overallTotal: number = 0;
	private currency;

	constructor(private plansService: PlanService, private utils: Utils) {
		this.currency = new Currency();
	}

	ngOnInit() {
		this.plansService.getPlans().subscribe(res => {
			this.activePlans = res['data']['payPlans'].sort(this.utils.sort('date'));

			this.payeeBreakdown = this.formatPayeeBreakdown(this.activePlans);
			this.cardBreakdown = this.formatCardBreakdown(this.activePlans);

			const totals = [];
			this.overallBreakdown = this.activePlans.map((plan, index) => {
				let totalAmtPaid = plan.payments.reduce(
					(total, payment) => this.currency.add(total, payment['amtPaid']),
					0.0,
				);

				if (index > 0) {
					totalAmtPaid = this.currency.add(totalAmtPaid, totals[index - 1]);
				}
				totals.push(totalAmtPaid);

				return {
					date: plan.date,
					amtPaid: totalAmtPaid,
				};
			});
			console.log('Overall: ', this.overallBreakdown);
			this.overallTotal = this.getOverallTotal();
		});
	}

	formatCardBreakdown(plans) {
		const mappedPlans = plans.map(plan => {
			const { card: { name = '' } = {} } = plan;
			const amtPaid = plan.payments.reduce((total, payment) => {
				const totalAmtPaid = this.currency.add(total, payment['amtPaid']);
				return totalAmtPaid;
			}, 0);

			return { [name]: { date: plan['date'], amtPaid } };
		});

		return mappedPlans;
	}

	getCardBreakdown(card, breakdown, index) {
		const total = index === 0 ? this.getTotal(card, 'card') : this.cardTotals[index - 1];
		const newTotal = breakdown[card.name]
			? this.currency.subtract(total, breakdown[card.name]['amtPaid'])
			: total;
		this.cardTotals[index] = newTotal;

		return newTotal;
	}

	formatPayeeBreakdown(plans) {
		return plans.map(plan => {
			const { payments } = plan;
			return payments.reduce((breakdown, payment) => {
				const payee = payment['responsibleParty']['name'];
				if (!breakdown[payee]) breakdown[payee] = 0;

				breakdown[payee] = this.currency.add(breakdown[payee], payment['amtPaid']);
				breakdown['date'] = plan['date'];
				return breakdown;
			}, {});
		});
	}

	getPayeeBreakdown(payee, breakdown, index) {
		const total =
			index === 0 ? this.getTotal(payee, 'responsibleParty') : this.payeeTotals[index - 1];
		const newTotal = breakdown[payee.name]
			? this.currency.subtract(total, breakdown[payee.name])
			: total;
		this.payeeTotals[index] = newTotal;

		return newTotal;
	}

	getTotal(selection, which) {
		return this.data.reduce((total, expense) => {
			if (expense[which]['name'] === selection.name) {
				total += expense.amtRemaining;
			}
			return total;
		}, 0);
	}

	getOverallTotal() {
		return this.data.reduce(
			(total, expense) => this.currency.add(total, expense['amtRemaining']),
			0.0,
		);
	}

	getTotalPerPayplan(breakdown) {
		console.log('Overall total: ', this.overallTotal);
		return this.currency.subtract(this.overallTotal, breakdown['amtPaid']);
	}

	getPayplanLabel(plan) {
		const formattedDate = this.utils.dateTransform(plan.date, DATE_FORMATS.SHORT_MO_NO_YR);
		return `${formattedDate} ${plan.card['name']} payment`;
	}

	setSelected(event, item, which) {
		const selectedList = which === 'card' ? this.cardsSelected : this.payeesSelected;
		if (event.checked) {
			selectedList.push(item.name);
		} else {
			const index = selectedList.findIndex(listItem => listItem === item.name);
			selectedList.splice(index, 1);
		}
		which === 'card' ? (this.cardsSelected = selectedList) : (this.payeesSelected = selectedList);
		this.filterUpdate.emit({ cardFilter: this.cardsSelected, payeeFilter: this.payeesSelected });
	}
}
