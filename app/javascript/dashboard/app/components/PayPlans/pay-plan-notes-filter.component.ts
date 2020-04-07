import { OnInit, Input, Output, EventEmitter, Component } from '@angular/core';
import * as moment from 'moment';

import { Currency } from './../../services/currency';
import './pay-plan-notes-filter.component.scss';

@Component({
	selector: 'app-pay-plan-notes-filter',
	template: `
		<div class="pay-plan-notes-filter">
			<div class="filter-label">How {{ payee }}'s paying...</div>
			<div *ngFor="let note of noteCategories" class="note-category">
				<mat-checkbox class="category" (change)="setNoteFilter($event, note)">{{
					note
				}}</mat-checkbox>
				<div class="categoryAmt">{{ groupedNotes[note] | currency }}</div>
			</div>
		</div>
	`,
})
export class PayPlanNotesFilter implements OnInit {
	@Input() planData: any[];
	@Input() payee: string;
	@Output() noteFilterSelected = new EventEmitter();

	public groupedNotes: any = {};
	public noteCategories: string[] = [];
	public noteFilters: string[] = [];
	private currency = null;

	constructor() {
		this.currency = new Currency();
	}

	ngOnInit() {
		this.groupNotes(this.planData, this.payee);
	}

	ngOnChanges() {
		this.groupNotes(this.planData, this.payee);
	}

	groupNotes(data, payee) {
		const matches = data.filter(data => data.payee === payee);
		if (matches && matches[0]) {
			const payments = matches[0]['payments'];
			this.groupedNotes = payments.reduce((categories, payment) => {
				const { howToPay, amtPaid } = payment;
				if (!categories[howToPay]) categories[howToPay] = 0.0;
				categories[howToPay] = this.currency.add(categories[howToPay], amtPaid);

				return categories;
			}, {});
		}

		this.noteCategories = Object.keys(this.groupedNotes);
	}

	setNoteFilter(event, note) {
		if (event.checked) {
			this.noteFilters.push(note);
		} else {
			const index = this.noteFilters.findIndex(n => n === note);
			this.noteFilters.splice(index, 1);
		}

		this.noteFilterSelected.emit({ noteFilters: this.noteFilters });
	}
}
