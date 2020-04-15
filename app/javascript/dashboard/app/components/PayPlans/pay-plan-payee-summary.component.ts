import { Component, Input, Output, EventEmitter } from '@angular/core';

import { ExpenseService } from '../../services/expense.service';
import { Currency } from '../../services/currency';
import templateStr from './pay-plan-payee-summary.component.html';
import './pay-plan-payee-summary.component.scss';

@Component({
	selector: 'app-plan-payee-summary',
	template: `
		<div class="pay-plan-payee-summary" (click)="onExpand(details.payee)">
			<div class="logistics">
				<span class="payee">{{ details.payee }}</span>
				<span class="amt">{{ details.amt | currency }}</span>
			</div>
			<div class="expand-option">
				<mat-icon class="add-button">arrow_right</mat-icon>
			</div>
		</div>
	`,
})
export class PayPlanPayeeSummary {
	@Input() details: any;
	@Output() detailRequested = new EventEmitter();

	public sideNavExpanded: boolean = false;
	public selected: boolean = false;
	public currency;

	constructor(private expenseService: ExpenseService) {
		this.currency = new Currency();
	}

	onExpand(payee) {
		this.detailRequested.emit({
			expanded: this.sideNavExpanded,
			payee: this.details['payee'],
		});
	}

	calculatePayeeTotal() {
		if (!this.details['payee']) return 0;

		const expenses = this.expenseService.getCachedExpenses();
		console.log('Expenses: ', expenses);
		return (expenses || [])
			.filter(expense => expense['responsibleParty']['name'] === this.details['payee'])
			.reduce((total, expense) => this.currency.add(total, this.calculateAmtRemaining(expense)), 0);
	}

	calculateAmtRemaining(expense) {
		console.log('In calculating amt remaining...');
		const amtLockedUp = this.currency.add(expense['amtPaid'], expense['amtPending']);
		return this.currency.subtract(expense['amtCharged'], amtLockedUp);
	}
}
