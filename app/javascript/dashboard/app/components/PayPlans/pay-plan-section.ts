import { OnInit, Component, Input } from '@angular/core';
import * as moment from 'moment';

import { UserService } from './../../services/user.service';
import { PlanService } from './../../services/plans.service';
import { PaymentService } from './../../services/payment.service';
import { Currency } from './../../services/currency';
import templateStr from './pay-plan-section.html';
import './pay-plan-section.scss';
import { TdDialogService } from '@covalent/core/dialogs';

@Component({
	selector: 'app-pay-plan-section',
	template: templateStr,
})
export class PayPlanSection implements OnInit {
	@Input() focusedPlan;
	public plans: any[] = [];
	public breakdown: any = null;
	public planIds: string[] = [];
	public isLoading: boolean = true;
	public selectedPlan: string = null;
	public sideNavOpen: string = '';
	public selectedPayee: string = null;
	public noteFilter: any = [];
	public deleteQueue: any[] = [];
	public archiveMode: boolean = false;
	private currency = null;

	constructor(
		private userService: UserService,
		private plansService: PlanService,
		private paymentService: PaymentService,
		private _dialogService: TdDialogService,
	) {
		this.currency = new Currency();
	}

	ngOnInit() {
		if (!this.focusedPlan) {
			this.retrievePlans();
		}
		this.paymentService.getPendingDeleteQueue().subscribe(queue => (this.deleteQueue = queue));
	}

	ngOnChanges() {
		if (!!this.focusedPlan) {
			const plan = this.focusedPlan;

			// if (!this.breakdown) this.breakdown = {};
			// this.plans = [];
			this.plans.push(plan);
			this.processPlan(plan);
			// this.planIds.push(plan['id']);
			// this.breakdown[plan['id']] = this.formatPayeeBreakdown(plan);
			this.archiveMode = true;
			this.selectedPlan = plan.id;
			this.isLoading = false;
		}
	}

	retrievePlans() {
		// const userId = this.userService.getUserId();
		this.plansService.getPlans().subscribe(result => {
			this.plans = result.data['payPlans'];
			this.plans.forEach(plan => {
				this.processPlan(plan);
				// if (!this.breakdown) {
				// 	this.breakdown = {};
				// }
				// this.planIds.push(plan['id']);
				// this.breakdown[plan['id']] = this.formatPayeeBreakdown(plan);
			});
			// this.plansService.cachePlans(this.plans);
			this.plans.length < 1 ? this.resetPayPlanSection() : (this.selectedPlan = this.plans[0].id);
			this.isLoading = false;
		});
	}

	processPlan(plan) {
		if (!this.breakdown) this.breakdown = {};

		this.planIds.push(plan['id']);
		this.breakdown[plan['id']] = this.formatPayeeBreakdown(plan);
	}

	getPlanLabel(plan) {
		if (!this.plans) return '';

		const prettyDate = moment(plan['date']).format('MMM Do, YYYY');
		return `${plan['card']['name']} (${prettyDate})`;
	}

	getPlanTotal(plan) {
		if (!this.plans) return '';
		return plan.payments.reduce((total, payment) => this.currency.add(total, payment.amtPaid), 0);
	}

	getPostDeleteAmt(plan) {
		if (plan && plan.id && this.deleteQueue[plan.id]) {
			const queuedIds = this.deleteQueue[plan.id];
			return plan.payments
				.filter(payment => !queuedIds.includes(payment.id))
				.reduce((total, payment) => this.currency.add(total, payment.amtPaid), 0);
		}

		return null;
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
			result.push({
				id: plan['id'],
				payee: p,
				amt: breakdown[p]['amt'],
				payments: breakdown[p]['payments'],
			});
		});

		console.log('Result: ', result);
		return result;
	}

	onPlanSelect(plan) {
		this.sideNavOpen = '';
		this.selectedPayee = null;
		this.noteFilter = '';
	}

	resetPayPlanSection() {
		this.sideNavOpen = '';
		this.selectedPayee = null;
		this.selectedPlan = '';
		this.noteFilter = '';
		this.planIds = [];
		this.breakdown = null;
	}

	handleSideNavToggle(info) {
		this.sideNavOpen = this.sideNavOpen === info.payee ? '' : info.payee;
		this.noteFilter = '';
		this.selectedPayee = info.expanded ? info.payee : null;
		console.log('Selected payee ', this.selectedPayee);
	}

	setNoteFilter(event) {
		this.noteFilter = event.noteFilters.join(';');
	}

	onConfirm(planId) {
		this._dialogService
			.openConfirm({
				message: 'Are you sure?',
				title: 'Confirm',
				cancelButton: 'Nope',
				acceptButton: 'Yep',
			})
			.afterClosed()
			.subscribe((accept: boolean) => {
				accept ? this.lockPayment(planId) : this._dialogService.closeAll();
			});
	}

	lockPayment(planId) {
		this.plansService.lockPlan(planId).subscribe(
			status => {
				if (status.data && status.data.lockPlan) {
					status.data.lockPlan.success
						? this.resetPayPlanSection()
						: console.log(`Partial or full lock error!`);
				}
			},
			err => console.log(`Error deleting payments: ${err}`),
		);
	}

	deletePayments() {
		const ids = Object.keys(this.deleteQueue).reduce((idArr, plan) => {
			return idArr.concat(this.deleteQueue[plan]);
		}, []);

		this.paymentService.deletePayment(ids).subscribe(
			status => {
				if (status.data && status.data.deletePayment) {
					status.data.deletePayment.success === 'success'
						? this.paymentService.clearPendingQueue()
						: console.log(`Partial or full deletion error!`);
				}
			},
			err => console.log(`Error deleting payments: ${err}`),
		);
	}
}
