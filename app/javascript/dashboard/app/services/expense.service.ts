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

	getExpenses(id, filters: object = null) {
		return this.apollo.watchQuery(Queries.retrieveExpenses(id)).valueChanges;
	}

	createExpense(id, params: object) {
		console.log('ExpenseService.ts#createExpense -- params: ', params);
		console.log('ExpenseService.ts#createExpense -- id: ', id);

		const query = gql`
			mutation createExpense(
				$userId: ID!
				$date: ISO8601DateTime!
				$retailer: String!
				$amtCharged: String!
				$responsibleParty: String!
				$card: String!
				$howToPay: String
			) {
				createExpense(
					userId: $userId
					date: $date
					retailer: $retailer
					amtCharged: $amtCharged
					responsibleParty: $responsibleParty
					card: $card
					howToPay: $howToPay
				) {
					id
				}
			}
		`;

		const formattedDate = moment(params['date']).format('YYYY-MM-DDThh:mm:ss');
		return this.apollo.mutate({
			mutation: Queries.createExpense()['query'],
			variables: {
				userId: id,
				...params,
				date: formattedDate,
			},
			refetchQueries: [
				{
					query: Queries.retrieveExpenses(id)['query'],
					variables: { id },
				},
			],
		});
	}

	updateExpense(id, expenseId, params: object) {
		console.log('ExpenseService.ts#updateExpense -- params: ', params);
		console.log('ExpenseService.ts#updateExpense -- id: ', id);

		const query = gql`
			mutation updateExpense(
				$userId: ID!
				$expenseId: ID!
				$date: ISO8601DateTime!
				$retailer: String!
				$amtCharged: String!
				$responsibleParty: String!
				$card: String!
				$howToPay: String
			) {
				updateExpense(
					userId: $userId
					expenseId: $expenseId
					date: $date
					retailer: $retailer
					amtCharged: $amtCharged
					responsibleParty: $responsibleParty
					card: $card
					howToPay: $howToPay
				) {
					id
				}
			}
		`;

		const formattedDate = moment(params['date']).format('YYYY-MM-DDThh:mm:ss');
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
					query: Queries.retrieveExpenses(id)['query'],
					variables: { id },
				},
			],
		});
	}

	deleteExpenses(id, expenseId: any[]) {
		console.log('ExpenseService.ts#deleteExpense');

		const query = gql`
			mutation deleteExpense($userId: ID!, $expenseId: [ID!]!) {
				deleteExpense(userId: $userId, expenseId: $expenseId) {
					success
				}
			}
		`;

		return this.apollo
			.mutate({
				mutation: Queries.deleteExpenses()['query'],
				variables: {
					userId: id,
					expenseId,
				},
				refetchQueries: [
					{
						query: Queries.retrieveExpenses(id)['query'],
						variables: { id },
					},
				],
			})
			.subscribe();
	}
}
