import { Injectable, Output, EventEmitter } from '@angular/core';
import { UserService } from './user.service';
import * as moment from 'moment';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

import * as Queries from './plans-queries';
import * as ExpenseQueries from './expense-queries';
import { Observable, of } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class PlanService {
	private plans;

	constructor(private apollo: Apollo, private userService: UserService) {}

	getPlans(archived: boolean = false) {
		console.log('Archived: ', archived);
		return this.apollo.watchQuery({
			query: Queries.retrievePlans()['query'],
			variables: { archived },
		}).valueChanges;
	}

	lockPlan(id: string) {
		return this.apollo.mutate({
			mutation: Queries.lockPlan()['query'],
			variables: { id },
			refetchQueries: [
				{ query: Queries.retrievePlans()['query'] },
				{ query: ExpenseQueries.retrieveExpenses()['query'] },
			],
		});
	}

	cachePlans(plans) {
		this.plans = plans;
	}

	getCachedPlans() {
		return this.plans;
	}
}
