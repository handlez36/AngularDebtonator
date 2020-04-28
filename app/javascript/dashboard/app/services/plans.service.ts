import { Injectable } from '@angular/core';
import { UserService } from './user.service';
import { Apollo } from 'apollo-angular';

import * as Queries from './plans-queries';
import * as ExpenseQueries from './expense-queries';
import { Observable, of, BehaviorSubject } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class PlanService {
	private plans;
	private _focusedPlan: BehaviorSubject<any> = new BehaviorSubject(null);
	private focusedPlanObs: Observable<any> = this._focusedPlan.asObservable();

	constructor(private apollo: Apollo, private userService: UserService) {}

	get focusedPlan() {
		return this.focusedPlanObs;
	}

	getPlans(archived: boolean = false) {
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

	setFocusedPlan(id) {
		console.log(`ID is ${id}`);
		this._focusedPlan.next(id);
	}

	removedFocusedPlan() {
		this._focusedPlan.next(null);
	}

	cachePlans(plans) {
		this.plans = plans;
	}

	getCachedPlans() {
		return this.plans;
	}
}
