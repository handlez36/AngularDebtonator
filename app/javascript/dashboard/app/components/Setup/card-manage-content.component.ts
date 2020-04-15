import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { SETUP_SAVE_STATES } from './../../utils/constants';
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

	constructor() {}

	ngOnInit() {
		this.cardName = this.selectedCard['name'];
	}

	ngOnChanges() {
		this.cardName = this.selectedCard['name'];
	}

	onNameChange(text) {
		this.cardName = text;
		this.cardNameUpdated.emit(this.cardName);
	}

	onSave() {
		console.log('Saving...');
		this.cardStatusUpdate.emit('SAVING');
		setTimeout(() => {
			this.cardStatusUpdate.emit('SAVED');
		}, 3000);
		setTimeout(() => {
			this.cardStatusUpdate.emit('ERROR');
		}, 6000);
	}

	onCancel() {
		console.log('Canceling...');
		this.cardStatusUpdate.emit(SETUP_SAVE_STATES.CANCEL);
	}
}
