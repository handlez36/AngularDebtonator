import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { SETUP_SAVE_STATES } from './../../utils/constants';
import './card-list.component.scss';

@Component({
	selector: 'app-card-list',
	template: `
		<div class="card-list flex-row">
			<div
				*ngFor="let card of cards"
				class="user-card flex-center"
				[id]="card.id"
				(click)="selectCard.emit(card.id)"
			>
				<ng-template
					*ngIf="shouldShow('SAVING', card)"
					class="update-name-loader"
					[tdLoading]="card.name + '-loader'"
					tdLoadingColor="warn"
					[tdLoadingUntil]="cardStatus !== 'SAVING'"
				></ng-template>
				<mat-icon *ngIf="shouldShow('SAVED', card)" class="saved-status success">check</mat-icon>
				<mat-icon *ngIf="shouldShow('ERROR', card)" class="saved-status error">error</mat-icon>
				<div class="card-text">{{ displayCard(card) }}</div>
			</div>
			<div class="user-card add-new flex-center" (click)="addCard.emit()">
				<mat-icon class="add-card-button">add</mat-icon>
				Add new
			</div>
		</div>
	`,
})
export class CardList implements OnInit {
	@Input() cards: any[];
	@Input() selectedCard: any;
	@Input() updatedName: string;
	@Input() cardStatus: string;
	@Output() selectCard = new EventEmitter();
	@Output() addCard = new EventEmitter();

	constructor() {}

	ngOnInit() {}

	displayCard(card) {
		if (
			this.selectedCard['id'] !== card['id'] ||
			this.cardStatus === SETUP_SAVE_STATES.IDLE ||
			this.cardStatus === SETUP_SAVE_STATES.CANCEL
		) {
			return card['name'];
		} else if (this.cardStatus === SETUP_SAVE_STATES.UPDATING) {
			return this.updatedName;
		} else {
			return SETUP_SAVE_STATES[this.cardStatus];
		}
	}

	shouldShow(status, card) {
		return this.cardStatus === status && this.selectedCard['id'] === card['id'];
	}
}
