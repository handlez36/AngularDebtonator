import { Injectable } from '@angular/core';
import { UserService } from './user.service';
import * as moment from 'moment';
import { Apollo } from 'apollo-angular';

import * as Queries from './payment-queries';
import * as PayplanQueries from './plans-queries';
import * as ExpenseQueries from './expense-queries';

@Injectable({
	providedIn: 'root',
})
export class PaymentService {
	private payments: object[] = [];

	constructor(private apollo: Apollo, private userService: UserService) {
		console.log('PaymentService.ts -- Payment Service being initiated');
	}

	createPayments(params: object) {
		console.log('PaymentService.ts#createPayment -- params: ', params);
		const formattedDate = moment(params['date']).format('YYYY-MM-DDThh:mm:ssZ');

		return this.apollo.mutate({
			mutation: Queries.createPayments()['query'],
			variables: {
				input: params,
				date: formattedDate,
			},
			refetchQueries: [
				{ query: PayplanQueries.retrievePlans()['query'] },
				{ query: ExpenseQueries.retrieveExpenses()['query'] },
			],
		});
	}

	// updateExpense(id, expenseId, params: object) {
	// 	console.log('ExpenseService.ts#updateExpense -- params: ', params);
	// 	console.log('ExpenseService.ts#updateExpense -- id: ', id);

	// 	const query = gql`
	// 		mutation updateExpense(
	// 			$userId: ID!
	// 			$expenseId: ID!
	// 			$date: ISO8601DateTime!
	// 			$retailer: String!
	// 			$amtCharged: String!
	// 			$responsibleParty: String!
	// 			$card: String!
	// 			$howToPay: String
	// 		) {
	// 			updateExpense(
	// 				userId: $userId
	// 				expenseId: $expenseId
	// 				date: $date
	// 				retailer: $retailer
	// 				amtCharged: $amtCharged
	// 				responsibleParty: $responsibleParty
	// 				card: $card
	// 				howToPay: $howToPay
	// 			) {
	// 				id
	// 			}
	// 		}
	// 	`;

	// 	const formattedDate = moment(params['date']).format('YYYY-MM-DDThh:mm:ssZ');
	// 	return this.apollo.mutate({
	// 		mutation: Queries.updateExpenses()['query'],
	// 		variables: {
	// 			userId: id,
	// 			expenseId,
	// 			...params,
	// 			amtCharged: `${params['amtCharged']}`,
	// 			date: formattedDate,
	// 		},
	// 		refetchQueries: [
	// 			{
	// 				query: Queries.retrieveExpenses(id)['query'],
	// 				variables: { id },
	// 			},
	// 		],
	// 	});
	// }

	// deleteExpenses(id, expenseId: any[]) {
	// 	console.log('ExpenseService.ts#deleteExpense');

	// 	const query = gql`
	// 		mutation deleteExpense($userId: ID!, $expenseId: [ID!]!) {
	// 			deleteExpense(userId: $userId, expenseId: $expenseId) {
	// 				success
	// 			}
	// 		}
	// 	`;

	// 	return this.apollo
	// 		.mutate({
	// 			mutation: Queries.deleteExpenses()['query'],
	// 			variables: {
	// 				userId: id,
	// 				expenseId,
	// 			},
	// 			refetchQueries: [
	// 				{
	// 					query: Queries.retrieveExpenses(id)['query'],
	// 					variables: { id },
	// 				},
	// 			],
	// 		})
	// 		.subscribe();
	// }
}
