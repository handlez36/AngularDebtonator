import { Component, OnInit } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import * as moment from 'moment';

import { TabularView } from './Common/tabular-view.component';
import { ExpenseService } from '../services/expense.service';
import { Utils } from '../services/utils.service';
import templateString from './expenses.component.html';
import './expenses.component.scss';
import { GraphQLError } from 'graphql/error';

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
	// apiError: string = null;
	apiError: any;
	gridType: GridType = GridType.TABLE;

	public FILTERABLE_FIELDS: string[] = [
		'retailer',
		'amtCharged',
		'amtPaid',
		'howToPay',
		'amtPending',
	];

	public COLUMNS: object = {
		card_payee: { label: '', width: 'xs' },
		date: { label: 'Date', width: 'md' },
		retailer: { label: 'Retailer', format: this.utils.truncatedStrTransform, width: 'md' },
		amtCharged: { label: 'Charged', format: this.utils.currencyTransform, width: 'sm' },
		pending_paid: { label: 'Payment Status', width: 'md' },
		amtRemaining: { label: 'Remaining', format: this.utils.currencyTransform, width: 'sm' },
		howToPay: { label: 'How To Pay', format: this.utils.truncatedStrTransform, width: 'lg' },
	};

	constructor(expenseService: ExpenseService, private utils: Utils) {
		this.expenseService = expenseService;
	}

	ngOnInit() {
		console.log('ExpensesComponent.ts -- Initializing expenses component.');
		// this.retrieveExpenses();
		this.retrieveExpensesGraph();
	}

	async retrieveExpenses() {
		console.log(' -- retrieveExpenses...');
		if (!this.expenseService) {
			// this.apiError = 'Sorry, the expenses Api cannot be called at the moment';
			return;
		}

		const { data, error } = await this.expenseService.getAllExpenses();
		this.expenses = data.map(item => ({
			...item,
			amt_remaining:
				parseFloat(item['amtCharged']) -
				(parseFloat(item['amtPaid']) + parseFloat(item['amtPending'])),
		}));
		this.apiError = error;
	}

	retrieveExpensesGraph() {
		console.log(' -- retrieveExpenses...');
		if (!this.expenseService) {
			// this.apiError = 'Sorry, the expenses Api cannot be called at the moment';
			return;
		}

		this.expenseService.getExpenses().subscribe(result => {
			console.log('Result: ', result);
			const expenses = result.data['expenses'];
			this.expenses = expenses.map(item => ({
				...item,
				amtRemaining:
					parseFloat(item['amtCharged']) -
					(parseFloat(item['amtPaid']) + parseFloat(item['amtPending'])),
			}));
			this.apiError = result.errors;
		});
	}
}
