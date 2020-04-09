import { Injectable, Output, EventEmitter } from '@angular/core';
import { UserService } from './user.service';
import * as moment from 'moment';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

import * as Queries from './plans-queries';

@Injectable({
	providedIn: 'root',
})
export class PlanService {
	constructor(private apollo: Apollo, private userService: UserService) {
		console.log('PlanService.ts -- Plan Service being initiated');
	}

	getPlans(filters: object = null) {
		return this.apollo.watchQuery(Queries.retrievePlans()).valueChanges;
	}
}
