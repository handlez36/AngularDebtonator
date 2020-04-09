import { OnInit, Component } from '@angular/core';
import * as moment from 'moment';

import { UserService } from './../../services/user.service';
import { PlanService } from './../../services/plans.service';
import { Currency } from './../../services/currency';
import templateStr from './pay-plan-section.html';
import './pay-plan-section.scss';

@Component({
	selector: 'app-pay-plan-section',
	template: templateStr,
})
export class PayPlanSection implements OnInit {
	public plans: any[] = [];
	public breakdown: any = null;
	public planIds: string[] = [];
	public isLoading: boolean = true;
	public selectedPlan: string = null;
	public sideNavOpen: string = '';
	public selectedPayee: string = null;
	public noteFilter: any = [];
	private currency = null;

	constructor(private userService: UserService, private plansService: PlanService) {
		this.currency = new Currency();
	}

	ngOnInit() {
		console.log('PayPlansSection.ts -- Initializing expenses component.');
		this.retrievePlans();
	}

	ngOnChange() {
		console.log('NgOnChange...');
	}

	retrievePlans() {
		// const userId = this.userService.getUserId();
		this.plansService.getPlans().subscribe(result => {
			this.plans = result.data['payPlans'];
			this.plans.forEach(plan => {
				if (!this.breakdown) {
					this.breakdown = {};
				}
				this.planIds.push(plan['id']);
				this.breakdown[plan['id']] = this.formatPayeeBreakdown(plan);
			});
			this.selectedPlan = this.plans.length > 0 ? this.plans[0].id : '';
			this.isLoading = false;
		});
	}

	getPlanLabel(plan) {
		if (!this.plans) return '';

		const prettyDate = moment(plan['date']).format('MMM Do, YYYY');
		return `${plan['card']['name']} - ${prettyDate}`;
	}

	formatPayeeBreakdown(plan) {
		const breakdown = [];
		const { payments } = plan;
		payments.forEach(payment => {
			const payee = payment['responsibleParty']['name'];

			if (!breakdown[payee]) {
				breakdown[payee] = { amt: 0, payments: [] };
			}

			breakdown[payee]['amt'] = this.currency.add(breakdown[payee]['amt'], payment['amtPaid']);
			breakdown[payee]['payments'].push(payment);
		});

		const payees = Object.keys(breakdown);
		const result = [];
		payees.forEach(p => {
			result.push({ payee: p, amt: breakdown[p]['amt'], payments: breakdown[p]['payments'] });
		});

		return result;
	}

	onPlanSelect(plan) {
		this.sideNavOpen = '';
		this.selectedPayee = null;
	}

	handleSideNavToggle(info) {
		this.sideNavOpen = this.sideNavOpen === info.payee ? '' : info.payee;
		this.noteFilter = '';
		this.selectedPayee = info.expanded ? info.payee : null;
	}

	setNoteFilter(event) {
		this.noteFilter = event.noteFilters.join(';');
	}
}
