import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';

import * as CardQueries from './card-queries';

@Injectable({
	providedIn: 'root',
})
export class CardService {
	private cards;

	constructor(private apollo: Apollo) {
		console.log('CardService.ts -- Card Service being initiated');
	}

	getCards(filters: object = null) {
		return this.apollo.watchQuery(CardQueries.retrieveCards()).valueChanges;
	}

	createCard(name: string) {
		return this.apollo.mutate({
			mutation: CardQueries.createCard()['query'],
			variables: { name },
			refetchQueries: [{ query: CardQueries.retrieveCards()['query'] }],
		});
	}

	updateCard(id: string, name: string) {
		return this.apollo.mutate({
			mutation: CardQueries.updateCard()['query'],
			variables: { name, id },
			refetchQueries: [{ query: CardQueries.retrieveCards()['query'] }],
		});
	}

	deleteCard(id: string) {
		return this.apollo.mutate({
			mutation: CardQueries.deleteCard()['query'],
			variables: { id },
			refetchQueries: [{ query: CardQueries.retrieveCards()['query'] }],
		});
	}
}
