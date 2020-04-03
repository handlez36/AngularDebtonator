import { Injectable } from '@angular/core';
import { UserService } from './user.service';
import axios from 'axios';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

@Injectable({
	providedIn: 'root',
})
export class ExpenseService {
	private expenses: object[] = [];

	constructor(private apollo: Apollo, private userService: UserService) {
		console.log('ExpenseService.ts -- Expense Service being initiated');
	}

	async getAllExpenses(filters: object = null) {
		const url = '/api/expenses';

		const response: object = await axios.get(url);

		if (response && response['data'] && response['status'] === 200) {
			const expenses = response['data'];
			this.expenses = expenses;

			return { data: expenses, error: null };
		} else {
			return { data: null, error: 'Error retrieving expense data' };
		}
	}

	getExpenses(filters: object = null) {
		const id = this.userService.getUserId();
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
                name
              }
              card {
                name
              }
              howToPay
            }
          }
        `,
		};

		return this.apollo.watchQuery(query).valueChanges;
	}
}
