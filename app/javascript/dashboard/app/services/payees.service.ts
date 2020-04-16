import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';

import * as PayeeQueries from './payees-queries';

@Injectable({
	providedIn: 'root',
})
export class PayeeService {
	constructor(private apollo: Apollo) {
		console.log('PayeeService.ts -- Payee Service being initiated');
	}

	getPayees(filters: object = null) {
		return this.apollo.watchQuery(PayeeQueries.retrievePayees()).valueChanges;
	}

	createPayee(name: string) {
		return this.apollo.mutate({
			mutation: PayeeQueries.createPayee()['query'],
			variables: { name },
			refetchQueries: [{ query: PayeeQueries.retrievePayees()['query'] }],
		});
	}

	updatePayee(id: string, name: string) {
		return this.apollo.mutate({
			mutation: PayeeQueries.updatePayee()['query'],
			variables: { name, id },
			refetchQueries: [{ query: PayeeQueries.retrievePayees()['query'] }],
		});
	}

	deletePayee(id: string) {
		return this.apollo.mutate({
			mutation: PayeeQueries.deletePayee()['query'],
			variables: { id },
			refetchQueries: [{ query: PayeeQueries.retrievePayees()['query'] }],
		});
	}
}
