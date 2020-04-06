import { OnInit, Input, Component } from '@angular/core';
import * as moment from 'moment';

import { Currency } from './../../services/currency';
import './pay-plan-payee-detail.component.scss';

@Component({
	selector: 'app-pay-plan-payee-detail',
	// template: templateStr,
	template: `
		<div class="pay-plan-payee-detail">
			<div *ngFor="let payment of payments" class="payment">
				<div class="retailer_and_date">
					<span class="retailer">{{
						payment.expense.retailer + ' (' + payment.howToPay + ')'
					}}</span>
					<span class="date">{{ payment.expense.date | date: 'MMM dd, yyyy' }}</span>
					<div class="amt">{{ payment.amtPaid | currency }}</div>
				</div>
				<hr />
			</div>
		</div>
	`,
})
export class PayPlanPayeeDetail implements OnInit {
	@Input() planData: any[];
	@Input() payee: string;

	public payments: any[] = [];
	private currency = null;

	constructor() {
		this.currency = new Currency();
	}

	ngOnInit() {
		const matches = this.planData.filter(data => data.payee === this.payee);
		if (matches && matches[0]) {
			this.payments = matches[0]['payments'];
		}
	}
}
