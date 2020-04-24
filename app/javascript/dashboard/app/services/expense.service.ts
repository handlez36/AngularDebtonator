import { Injectable, Output, EventEmitter } from '@angular/core';
import { UserService } from './user.service';
import * as moment from 'moment';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

import * as ExpenseQueries from './expense-queries';
import * as PayplanQueries from './plans-queries';

@Injectable({
	providedIn: 'root',
})
export class ExpenseService {
	private expenses: object[] = [];
	private id: string = null;

	constructor(private apollo: Apollo, private userService: UserService) {}

	getExpenses(filters: object = null) {
		return this.apollo.watchQuery(ExpenseQueries.retrieveExpenses()).valueChanges;
	}

	createExpense(id, params: object) {
		const formattedDate = moment.utc(params['date']).format('YYYY-MM-DDThh:mm:ssZ');

		return this.apollo.mutate({
			mutation: ExpenseQueries.createExpense()['query'],
			variables: {
				...params,
				date: formattedDate,
			},
			refetchQueries: [
				{
					query: ExpenseQueries.retrieveExpenses()['query'],
					variables: { id },
				},
			],
		});
	}

	updateExpense(id, expenseId, params: object) {
		const formattedDate = moment.utc(params['date']).format('YYYY-MM-DDThh:mm:ssZ');
		return this.apollo.mutate({
			mutation: ExpenseQueries.updateExpenses()['query'],
			variables: {
				userId: id,
				expenseId,
				...params,
				amtCharged: `${params['amtCharged']}`,
				date: formattedDate,
			},
			refetchQueries: [
				{
					query: ExpenseQueries.retrieveExpenses()['query'],
					variables: { id },
				},
			],
		});
	}

	deleteExpenses(expenseId: any[]) {
		return this.apollo
			.mutate({
				mutation: ExpenseQueries.deleteExpenses()['query'],
				variables: {
					expenseId,
				},
				refetchQueries: [
					{ query: ExpenseQueries.retrieveExpenses()['query'] },
					{ query: PayplanQueries.retrievePlans()['query'] },
				],
			})
			.subscribe();
	}

	cacheExpenses(expenses) {
		this.expenses = expenses;
	}

	getCachedExpenses() {
		return this.expenses;
	}
}
