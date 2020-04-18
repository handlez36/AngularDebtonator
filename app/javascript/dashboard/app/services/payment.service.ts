import { Injectable } from '@angular/core';
import { UserService } from './user.service';
import * as moment from 'moment';
import { Apollo } from 'apollo-angular';

import * as Queries from './payment-queries';
import * as PayplanQueries from './plans-queries';
import * as ExpenseQueries from './expense-queries';
import { Observable, of, BehaviorSubject, Subject } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class PaymentService {
	private payments: object[] = [];
	private _paymentDeletionQueue: BehaviorSubject<any> = new BehaviorSubject({});
	private paymentDeletionQueue: Observable<any> = this._paymentDeletionQueue.asObservable();

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

	deletePayment(id: any[]) {
		console.log('PaymentService.ts#deletePayment -- params: ', id);

		return this.apollo.mutate({
			mutation: Queries.deletePayment()['query'],
			variables: { id },
			refetchQueries: [
				{ query: PayplanQueries.retrievePlans()['query'] },
				{ query: ExpenseQueries.retrieveExpenses()['query'] },
			],
		});
	}

	getPendingDeleteQueue() {
		return this.paymentDeletionQueue;
	}

	updatePendingQueue(planId, paymentId) {
		const current = this._paymentDeletionQueue.getValue();

		if (!current[planId]) {
			current[planId] = [];
		}

		if (current[planId].includes(paymentId)) {
			this.deleteFromPendingQueue(current, planId, paymentId);
		} else {
			this.addToPendingDeleteQueue(current, planId, paymentId);
		}
	}

	addToPendingDeleteQueue(current, planId, paymentId) {
		current[planId].push(paymentId);
		this._paymentDeletionQueue.next(current);
	}

	deleteFromPendingQueue(current, planId, paymentId) {
		const paymentIndex = current[planId].indexOf(paymentId);
		if (paymentIndex >= 0) {
			current[planId].splice(paymentIndex, 1);
			this._paymentDeletionQueue.next(current);
		}
	}

	clearPendingQueue() {
		this._paymentDeletionQueue.next({});
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
