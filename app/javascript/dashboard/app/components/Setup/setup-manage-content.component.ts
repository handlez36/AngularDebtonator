import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { SETUP_SAVE_STATES } from './../../utils/constants';
import { CardService } from './../../services/card.service';
import templateString from './setup-manage-content.component.html';
import './setup-manage-content.component.scss';

@Component({
	selector: 'app-setup-manage-content',
	template: templateString,
})
export class SetupManageContent implements OnInit {
	@Input() selectedItem: any = {};
	@Input() mode: string = '';
	@Output() itemNameUpdated = new EventEmitter();
	@Output() itemStatusUpdate = new EventEmitter();

	public itemName: string = '';

	constructor(private cardService: CardService) {}

	ngOnInit() {
		this.itemName = this.selectedItem['name'];
	}

	ngOnChanges() {
		this.itemName = this.selectedItem['name'] ? this.selectedItem['name'] : '';
	}

	onNameChange(text) {
		this.itemName = text;
		this.itemNameUpdated.emit(this.itemName);
	}

	onSave() {
		this.itemStatusUpdate.emit('SAVING');

		const operationType = this.mode === 'ADD' ? 'createCard' : 'updateCard';
		const operation: any =
			this.mode === 'ADD'
				? this.cardService.createCard(this.itemName)
				: this.cardService.updateCard(this.selectedItem['id'], this.itemName);

		operation.subscribe(
			response => {
				if (
					response['data'] &&
					response['data'][operationType] &&
					!response['data'][operationType]['errors']
				) {
					this.itemStatusUpdate.emit('SAVED');
				} else {
					this.itemStatusUpdate.emit('ERROR');
				}
				setTimeout(() => {
					this.itemStatusUpdate.emit(SETUP_SAVE_STATES.IDLE);
				}, 1000);
			},
			error => {
				console.log('Error creating card! ', error), this.itemStatusUpdate.emit('ERROR');
			},
		);
	}

	onDelete() {
		this.cardService.deleteCard(this.selectedItem['id']).subscribe(
			response => {
				if (
					response['data'] &&
					response['data']['deleteCard'] &&
					!response['data']['deleteCard']['errors']
				) {
					this.itemStatusUpdate.emit(SETUP_SAVE_STATES.IDLE);
				} else {
					this.itemStatusUpdate.emit(SETUP_SAVE_STATES.ERROR);
				}
			},
			error => {
				console.log('Error deleting card! ', error), this.itemStatusUpdate.emit('ERROR');
			},
		);
	}

	onCancel() {
		this.itemStatusUpdate.emit(SETUP_SAVE_STATES.CANCEL);
	}
}
