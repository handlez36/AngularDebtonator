import { Component, OnInit } from '@angular/core';

import { SETUP_SAVE_STATES, SETUP_UPDATE_MODE } from './../../utils/constants';
import templateString from './card-manage.component.html';
import './card-manage.component.scss';

@Component({
	selector: 'app-card-manage-section',
	template: templateString,
})
export class CardManageSection implements OnInit {
	public showContent: boolean = false;
	public selectedCard: any = {};
	public mode: string = '';
	public updatedCardName: string = '';
	public footerStatus: string = 'IDLE';

	cards = [
		{
			name: 'AmEx',
			id: 1,
		},
		{ name: 'Suntrust', id: 2 },
		{ name: 'BofA', id: 3 },
	];
	constructor() {}

	ngOnInit() {}

	onStartAdd() {
		this.toggleShowContent();
		this.mode = SETUP_UPDATE_MODE.ADD;
	}

	onCardSelect(id) {
		if (id === this.selectedCard['id']) {
			this.showContent = false;
			this.selectedCard = {};
		} else {
			this.showContent = true;
			this.selectedCard = this.findCard(id);
			console.log('Selected card: ', this.selectedCard);
		}
		this.mode = SETUP_UPDATE_MODE.EDIT;
	}

	findCard(id) {
		const matches = this.cards.filter(card => card.id === id);
		return matches && matches[0] ? matches[0] : {};
	}

	onUpdateCardName(name) {
		this.updatedCardName = name;
		this.footerStatus = SETUP_SAVE_STATES.UPDATING;
	}

	onCardStatusUpdate(status) {
		if (status !== SETUP_SAVE_STATES.CANCEL) {
			this.footerStatus = status;
		} else {
			this.resetView();
		}
	}

	resetView() {
		this.footerStatus = SETUP_SAVE_STATES.IDLE;
		this.showContent = false;
		this.selectedCard = {};
		this.mode = '';
		this.updatedCardName = '';
	}

	toggleShowContent() {
		this.showContent = !this.showContent;
	}
}
