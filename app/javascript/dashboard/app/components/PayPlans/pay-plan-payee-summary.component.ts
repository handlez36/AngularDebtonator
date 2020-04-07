import { Component, Input, Output, EventEmitter } from '@angular/core';

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

	constructor() {}

	onExpand(payee) {
		console.log('In summary; Current state: ', this.sideNavExpanded);
		// this.sideNavExpanded = !this.sideNavExpanded;
		this.detailRequested.emit({
			expanded: this.sideNavExpanded,
			payee: this.details['payee'],
		});

		// console.log('PayPlanPayeeSummary - Currently selected --> ', this.selected);
		// console.log('PayPlanPayeeSummary - Clicked on --> ', payee);
		// this.selected = this.sideNavExpanded;
		// if (!this.sideNavExpanded) {
		// 	// If nav is currently closed, just open
		// 	this.sideNavExpanded = true;
		// } else {
		// 	// If nav is current only, only close if the payee you clicked on is the same as the incoming payee
		// 	this.sideNavExpanded = payee === this.selected ? false : true;
		// }

		// this.detailRequested.emit({
		// 	expanded: this.sideNavExpanded,
		// 	payee: this.details['payee'],
		// });
	}
}
