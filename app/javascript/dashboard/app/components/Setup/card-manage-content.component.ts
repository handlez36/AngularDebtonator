import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { SETUP_SAVE_STATES } from './../../utils/constants';
import { CardService } from './../../services/card.service';
import templateString from './card-manage-content.component.html';
import './card-manage-content.component.scss';

@Component({
	selector: 'app-card-manage-content',
	template: templateString,
})
export class CardManageContent implements OnInit {
	@Input() selectedCard: any = {};
	@Input() mode: string = '';
	@Output() cardNameUpdated = new EventEmitter();
	@Output() cardStatusUpdate = new EventEmitter();

	public cardName: string = '';

	constructor(private cardService: CardService) {}

	ngOnInit() {
		this.cardName = this.selectedCard['name'];
	}

	ngOnChanges() {
		this.cardName = this.selectedCard['name'] ? this.selectedCard['name'] : '';
	}

	onNameChange(text) {
		this.cardName = text;
		this.cardNameUpdated.emit(this.cardName);
	}

	onSave() {
		console.log('Saving...');
		this.cardStatusUpdate.emit('SAVING');

		const operationType = this.mode === 'ADD' ? 'createCard' : 'updateCard';
		const operation: any =
			this.mode === 'ADD'
				? this.cardService.createCard(this.cardName)
				: this.cardService.updateCard(this.selectedCard['id'], this.cardName);

		operation.subscribe(
			response => {
				if (
					response['data'] &&
					response['data'][operationType] &&
					!response['data'][operationType]['errors']
				) {
					this.cardStatusUpdate.emit('SAVED');
				} else {
					this.cardStatusUpdate.emit('ERROR');
				}
				setTimeout(() => {
					this.cardStatusUpdate.emit(SETUP_SAVE_STATES.IDLE);
				}, 1000);
			},
			error => {
				console.log('Error creating card! ', error), this.cardStatusUpdate.emit('ERROR');
			},
		);
	}

	onDelete() {
		this.cardService.deleteCard(this.selectedCard['id']).subscribe(
			response => {
				if (
					response['data'] &&
					response['data']['deleteCard'] &&
					!response['data']['deleteCard']['errors']
				) {
					this.cardStatusUpdate.emit(SETUP_SAVE_STATES.IDLE);
				} else {
					this.cardStatusUpdate.emit(SETUP_SAVE_STATES.ERROR);
				}
			},
			error => {
				console.log('Error deleting card! ', error), this.cardStatusUpdate.emit('ERROR');
			},
		);
	}

	onCancel() {
		console.log('Canceling...');
		this.cardStatusUpdate.emit(SETUP_SAVE_STATES.CANCEL);
	}
}
