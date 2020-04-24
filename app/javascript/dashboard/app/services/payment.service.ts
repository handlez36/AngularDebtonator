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
	private _paymentDeletionQueue: BehaviorSubject<any> = new BehaviorSubject({});
	private paymentDeletionQueue: Observable<any> = this._paymentDeletionQueue.asObservable();

	constructor(private apollo: Apollo, private userService: UserService) {}

	createPayments(params: object) {
		const formattedDate = moment.utc(params['date']).hour(8).format('YYYY-MM-DDThh:mm:ssZ');

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
			if (current[planId].length < 1) {
				delete current[planId];
			}
			this._paymentDeletionQueue.next(current);
		}
	}

	clearPendingQueue() {
		this._paymentDeletionQueue.next({});
	}
}
