import { Injectable } from '@angular/core';
import { UserService } from './user.service';
import * as moment from 'moment';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

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
		const query = {
			query: gql`
          {
            expenses(id: ${id}) {
              id,
              date,
              retailer,
              amtCharged,
              amtPending,
              amtPaid,
              responsibleParty {
                id
                name
              }
              card {
                id
                name
              }
              howToPay
            }
          }
        `,
		};

		return this.apollo.watchQuery(query).valueChanges;
	}

	createExpense(id, params: object) {
		console.log('ExpenseService.ts#createExpense -- params: ', params);
		console.log('ExpenseService.ts#createExpense -- id: ', id);

		const query = gql`
			mutation createExpense(
				$userId: ID!
				$date: ISO8601Date!
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

		const formattedDate = moment(params['date']).format('YYYY-MM-DD');
		return this.apollo
			.mutate({
				mutation: query,
				variables: {
					userId: id,
					...params,
					date: formattedDate,
				},
			})
			.subscribe();
	}

	updateExpense(id, params: object, type: string) {
		console.log('ExpenseService.ts#updateExpense -- params: ', params);
		console.log('ExpenseService.ts#updateExpense -- id: ', id);

		const query = gql`
			mutation updateExpense(
				$userId: ID!
				$expenseId: ID!
				$date: ISO8601Date!
				$retailer: String!
				$amtCharged: Float!
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

		const formattedDate = moment(params['date']).format('YYYY-MM-DD');
		return this.apollo
			.mutate({
				mutation: query,
				variables: {
					userId: id,
					...params,
					date: formattedDate,
				},
			})
			.subscribe();
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
				mutation: query,
				variables: {
					userId: id,
					expenseId,
				},
			})
			.subscribe();
	}
}
