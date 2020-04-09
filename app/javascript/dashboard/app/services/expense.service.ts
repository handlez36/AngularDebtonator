import { Injectable, Output, EventEmitter } from '@angular/core';
import { UserService } from './user.service';
import * as moment from 'moment';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

import * as Queries from './expense-queries';

@Injectable({
	providedIn: 'root',
})
export class ExpenseService {
	private expenses: object[] = [];
	private id: string = null;

	constructor(private apollo: Apollo, private userService: UserService) {
		console.log('ExpenseService.ts -- Expense Service being initiated');
	}

	getExpenses(filters: object = null) {
		return this.apollo.watchQuery(Queries.retrieveExpenses()).valueChanges;
	}

	createExpense(id, params: object) {
		console.log('ExpenseService.ts#createExpense -- params: ', params);
		const formattedDate = moment(params['date']).format('YYYY-MM-DDThh:mm:ssZ');

		return this.apollo.mutate({
			mutation: Queries.createExpense()['query'],
			variables: {
				...params,
				date: formattedDate,
			},
			refetchQueries: [
				{
					query: Queries.retrieveExpenses()['query'],
					variables: { id },
				},
			],
		});
	}

	updateExpense(id, expenseId, params: object) {
		console.log('ExpenseService.ts#updateExpense -- params: ', params);
		console.log('ExpenseService.ts#updateExpense -- id: ', id);

		const formattedDate = moment(params['date']).format('YYYY-MM-DDThh:mm:ssZ');
		return this.apollo.mutate({
			mutation: Queries.updateExpenses()['query'],
			variables: {
				userId: id,
				expenseId,
				...params,
				amtCharged: `${params['amtCharged']}`,
				date: formattedDate,
			},
			refetchQueries: [
				{
					query: Queries.retrieveExpenses()['query'],
					variables: { id },
				},
			],
		});
	}

	deleteExpenses(id, expenseId: any[]) {
		console.log('ExpenseService.ts#deleteExpense');

		return this.apollo
			.mutate({
				mutation: Queries.deleteExpenses()['query'],
				variables: {
					expenseId,
				},
				refetchQueries: [
					{
						query: Queries.retrieveExpenses()['query'],
						variables: { id },
					},
				],
			})
			.subscribe();
	}
}
