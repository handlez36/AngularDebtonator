import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';

import templateString from './archived-payplans.component.html';
import { PlanService } from './../../services/plans.service';
import { Utils } from './../../services/utils.service';
import { Currency } from './../../services/currency';
import './archived-payplans.component.scss';

@Component({
	selector: 'app-archived-payplan',
	template: templateString,
})
export class ArchivedPayPlan implements OnInit {
	public plans: any[] = null;
	public rawPlans: any[] = null;
	public isLoading: boolean = false;
	public currency: any;
	public focusedPlan: any = null;

	private columns: object = {
		date: { label: 'Date', width: 'md' },
		card: { label: 'Card', width: 'md' },
		amtPaid: { label: 'Paid', format: this.utils.currencyTransform, width: 'sm' },
	};

	constructor(private plansService: PlanService, private utils: Utils) {
		this.currency = new Currency();
	}

	ngOnInit() {
		this.retrieveArchivedPlans();
		this.plansService.focusedPlan.subscribe(
			details => {
				this.focusedPlan = this.findFocusedPlan(details);
				console.log('Setting focused plan to ', this.focusedPlan);
			},
			err => console.log(`Error retrieving focused plan updates: ${err}`),
		);
	}

	findFocusedPlan(id) {
		if (!id) return null;

		const matches = this.rawPlans.filter(plan => `${plan.id}` === `${id}`);
		return matches && matches[0] ? matches[0] : null;
	}

	retrieveArchivedPlans() {
		this.isLoading = true;
		this.plansService.getPlans(true).subscribe(result => {
			if (result.data && result.data['payPlans']) {
				this.rawPlans = result.data['payPlans'];
				this.plans = this.formatData(result.data['payPlans']);
				this.isLoading = false;
			}
		});
	}

	onPlanSelected(event) {
		console.log(`Archived Payplan captured event `, event);
	}

	formatData(data) {
		return data
			.map(plan => {
				return {
					id: plan.id,
					date: plan.date,
					card: plan.card.name,
					amtPaid: plan.payments.reduce(
						(total, payment) => this.currency.add(total, payment.amtPaid),
						0,
					),
				};
			})
			.sort((a, b) => (moment(a.date).isBefore(moment(b.date)) ? 1 : -1));
	}
}
