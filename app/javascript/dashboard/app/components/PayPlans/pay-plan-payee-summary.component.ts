import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

import { ExpenseService } from '../../services/expense.service';
import { Currency } from '../../services/currency';

import { PaymentService } from '../../services/payment.service';
import './pay-plan-payee-summary.component.scss';

@Component({
	selector: 'app-plan-payee-summary',
	template: `
		<div class="pay-plan-payee-summary" (click)="onExpand(details.payee)">
			<div class="logistics">
				<span class="payee">{{ details.payee }}</span>
				<div class="amt-section">
					<span class="amt">{{ details.amt | currency }}</span>
					<span *ngIf="showTotalWithPaymentsDeleted()" class="amt-after-delete">
						| {{ calculateAmtAfterDeletion() | currency }}</span
					>
				</div>
			</div>
			<div class="expand-option">
				<mat-icon class="add-button">arrow_right</mat-icon>
			</div>
		</div>
	`,
})
export class PayPlanPayeeSummary implements OnInit {
	@Input() details: any;
	@Output() detailRequested = new EventEmitter();

	public sideNavExpanded: boolean = false;
	public selected: boolean = false;
	public deletionQueue: any[] = [];
	public currency;

	constructor(private expenseService: ExpenseService, private paymentService: PaymentService) {
		this.currency = new Currency();
		this.paymentService.getPendingDeleteQueue().subscribe(queue => (this.deletionQueue = queue));
	}

	ngOnInit() {
		console.log('Details: ', this.details);
	}

	onExpand(payee) {
		this.detailRequested.emit({
			expanded: this.sideNavExpanded,
			payee: this.details['payee'],
		});
	}

	// calculatePayeeTotal() {
	// 	if (!this.details['payee']) return 0;

	// 	const expenses = this.expenseService.getCachedExpenses();
	// 	return (expenses || [])
	// 		.filter(expense => expense['responsibleParty']['name'] === this.details['payee'])
	// 		.reduce((total, expense) => this.currency.add(total, this.calculateAmtRemaining(expense)), 0);
	// }

	// calculateAmtRemaining(expense) {
	// 	const amtLockedUp = this.currency.add(expense['amtPaid'], expense['amtPending']);
	// 	return this.currency.subtract(expense['amtCharged'], amtLockedUp);
	// }

	showTotalWithPaymentsDeleted() {
		const planId = this.details['id'];
		const paymentIds = this.details['payments'].map(p => p['id']);

		return (
			Object.keys(this.deletionQueue).length > 0 &&
			this.deletionQueue[planId] &&
			this.deletionQueue[planId].some(toDelete => paymentIds.includes(toDelete))
		);
	}

	calculateAmtAfterDeletion() {
		const planId = this.details['id'];
		const payments = this.details['payments'].map(p => ({ id: p['id'], amt: p['amtPaid'] }));
		const paymentIdsToDelete = this.deletionQueue[planId];

		const amtToDelete = payments
			.filter(payment => paymentIdsToDelete.includes(payment.id))
			.reduce((total, payment) => this.currency.add(total, payment['amt']), 0.0);

		return this.currency.subtract(this.details.amt, amtToDelete);
	}
}
