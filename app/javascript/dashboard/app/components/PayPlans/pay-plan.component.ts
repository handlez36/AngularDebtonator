import { OnInit, Input, Component } from '@angular/core';
import * as moment from 'moment';

import templateStr from './pay-plan.component.html';
import './pay-plan.component.scss';

@Component({
	selector: 'app-pay-plan',
	template: templateStr,
})
export class PayPlan implements OnInit {
	@Input() plan: any = null;
	public planBreakdown: object = {};

	constructor() {}

	ngOnInit() {
		console.log('PayPlan.ts#ngOnInit()');
		this.formatPlanData(this.plan);
	}

	ngOnChanges(props) {
		console.log('PayPlan.ts#ngOnChanges()');
		console.log('Plan: ', this.plan);
		console.log('Reg date: ', this.plan['date']);
		console.log('Reg date: ', this.plan['id']);
		console.log('Date: ', moment(this.plan['date']).format('MMM Do, YYYY'));
		this.formatPlanData(this.plan);
	}

	formatPlanData(plan) {
		if (!plan) return;

		console.log('Plan: ', plan);
		let obj = {};
		const payments = plan.payments.forEach(d => {
			const name = d['responsibleParty']['name'];
			if (!Object.keys(obj).includes(d['responsibleParty']['name'])) {
				obj[name] = [];
			}
			obj[name].push(d);
		});
		this.planBreakdown = obj;
	}

	getDate() {
		return moment(this.plan['date']).format('MMM Do, YYYY');
	}

	getPayees() {
		return Object.keys(this.planBreakdown);
	}

	getTotal(payee) {
		return this.plan.payments.reduce((total, payment) => {
			console.log('Payee ', payee);
			console.log('Processing ', payment);
			if (payment.responsibleParty.name === payee) {
				total += parseFloat(payment.amtPaid);
			}
			return total;
		}, 0.0);
	}
}
