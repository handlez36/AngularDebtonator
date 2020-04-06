import { Component, Input, Output, EventEmitter } from '@angular/core';

import templateStr from './pay-plan-payee-summary.component.html';
import './pay-plan-payee-summary.component.scss';

@Component({
	selector: 'app-plan-payee-summary',
	template: `
		<div class="pay-plan-payee-summary">
			<div class="logistics">
				<span class="payee">{{ details.payee }}</span>
				<span class="amt">{{ details.amt | currency }}</span>
			</div>
			<div class="expand-option">
				<mat-icon class="add-button" (click)="onExpand()">arrow_right</mat-icon>
			</div>
		</div>
	`,
})
export class PayPlanPayeeSummary {
	@Input() details: any;
	@Output() detailRequested = new EventEmitter();
	public sideNavExpanded: boolean = false;

	constructor() {}

	onExpand() {
		this.sideNavExpanded = !this.sideNavExpanded;
		this.detailRequested.emit({
			expanded: this.sideNavExpanded,
			payee: this.details['payee'],
		});
	}
}
