import { OnInit, Input, Component } from '@angular/core';

import { PaymentService } from './../../services/payment.service';
import { Currency } from './../../services/currency';
import './pay-plan-payee-detail.component.scss';

@Component({
	selector: 'app-pay-plan-payee-detail',
	template: `
		<div class="pay-plan-payee-detail">
			<div
				*ngFor="let payment of filteredPayments"
				[class]="'payment-wrapper' + getDeletionFlaggedClass(payment)"
			>
				<div class="payment">
					<div class="primary_and_subtext">
						<span class="retailer">{{ payment.expense.retailer }}</span>
						<span class="how">{{ payment.howToPay }}</span>
					</div>
					<div class="amt">
						{{ payment.amtPaid | currency }}
					</div>
				</div>
				<div class="date-row">
					<div class="date">{{ payment.expense.date | date: 'MMM dd, yyyy' }}</div>
					<mat-icon
						class="delete"
						(click)="paymentService.updatePendingQueue(payment['payplan']['id'], payment['id'])"
						>delete</mat-icon
					>
				</div>
			</div>
		</div>
	`,
})
export class PayPlanPayeeDetail implements OnInit {
	@Input() planData: any[];
	@Input() payee: string;
	@Input() noteFilter: string = '';

	public payments: any[] = [];
	public filteredPayments: any[] = [];
	public deleteQueue: any[] = [];
	private currency = null;

	constructor(private paymentService: PaymentService) {
		this.currency = new Currency();
	}

	ngOnInit() {
		this.parseData(this.planData);
		this.paymentService.getPendingDeleteQueue().subscribe(queue => (this.deleteQueue = queue));
	}

	ngOnChanges() {
		this.parseData(this.planData);
		this.applyFilters(this.noteFilter);
	}

	parseData(data) {
		const matches = data.filter(data => data.payee === this.payee);
		if (matches && matches[0]) {
			this.payments = matches[0]['payments'].sort((a, b) => {
				if (a.howToPay < b.howToPay) return -1;
				if (b.howToPay < a.howToPay) return 1;
				return 0;
			});
			this.filteredPayments = this.payments;
		}
	}

	applyFilters(noteFilter) {
		if (noteFilter.length > 0) {
			const filter = this.noteFilter.split(';');
			this.filteredPayments = this.payments.filter(p => filter.includes(p.howToPay));
		} else {
			this.filteredPayments = this.payments;
		}
	}

	getDeletionFlaggedClass(payment) {
		const planId = payment['payplan']['id'];
		const isflaggedForDeletion =
			this.deleteQueue[planId] && this.deleteQueue[planId].includes(payment['id']);
		return isflaggedForDeletion ? ' flagged' : '';
	}
}
