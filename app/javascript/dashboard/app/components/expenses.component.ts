import { Component, OnInit } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import * as moment from 'moment';

import { TabularView } from './Common/tabular-view.component';
import { ExpenseService } from '../services/expense.service';
import { Utils } from '../services/utils.service';
import templateString from './expenses.component.html';
import './expenses.component.scss';

enum GridType {
	TABLE = 1,
}

@Component({
	selector: 'app-expenses',
	template: templateString,
})
export class ExpensesComponent implements OnInit {
	GridTypeEnum = GridType;
	expenseService: ExpenseService;
	expenses: object[] = [];
	apiError: string = null;
	gridType: GridType = GridType.TABLE;

	public FILTERABLE_FIELDS: string[] = [
		'retailer',
		'amt_charged',
		'amt_paid',
		'how_to_pay',
		'card_id',
		'responsible_party_id',
		'amt_pending',
	];

	public COLUMNS: object = {
		card_payee: { label: '', width: 'xs' },
		date: { label: 'Date', width: 'md' },
		retailer: { label: 'Retailer', format: this.utils.truncatedStrTransform, width: 'md' },
		amt_charged: { label: 'Charged', format: this.utils.currencyTransform, width: 'sm' },
		pending_paid: { label: 'Payment Status', width: 'md' },
		amt_remaining: { label: 'Remaining', format: this.utils.currencyTransform, width: 'sm' },
		how_to_pay: { label: 'How To Pay', format: this.utils.truncatedStrTransform, width: 'lg' },
		// card_id: { label: 'Card', format: this.utils.truncatedStrTransform },
		// responsible_party_id: { label: 'Responsible Party', format: this.utils.truncatedStrTransform },
	};

	constructor(expenseService: ExpenseService, private utils: Utils) {
		this.expenseService = expenseService;
	}

	ngOnInit() {
		console.log('ExpensesComponent.ts -- Initializing expenses component.');
		this.retrieveExpenses();
	}

	async retrieveExpenses() {
		console.log(' -- retrieveExpenses...');
		if (!this.expenseService) {
			this.apiError = 'Sorry, the expenses Api cannot be called at the moment';
			return;
		}

		const { data, error } = await this.expenseService.getAllExpenses();
		this.expenses = data.map(item => ({
			...item,
			amt_remaining:
				parseFloat(item['amt_charged']) -
				(parseFloat(item['amt_paid']) + parseFloat(item['amt_pending'])),
		}));
		this.apiError = error;
	}
}
