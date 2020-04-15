import { Component, OnInit } from '@angular/core';

import { SETUP_SAVE_STATES, SETUP_UPDATE_MODE } from './../../utils/constants';
import { CardService } from './../../services/card.service';
import templateString from './card-manage.component.html';
import './card-manage.component.scss';

@Component({
	selector: 'app-card-manage-section',
	template: templateString,
})
export class CardManageSection implements OnInit {
	public cards: any[] = [];
	public showContent: boolean = false;
	public selectedCard: any = {};
	public mode: string = '';
	public updatedCardName: string = '';
	public footerStatus: string = 'IDLE';

	constructor(private cardService: CardService) {}

	ngOnInit() {
		this.cardService.getCards().subscribe(
			response => {
				if (response.data && response.data['cards']) {
					this.cards = response.data['cards'];
				}
			},
			error => console.log('Error retrieving card data'),
			() => console.log('Finished retrieving card data'),
		);
	}

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
		if (status !== SETUP_SAVE_STATES.CANCEL && status !== SETUP_SAVE_STATES.IDLE) {
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
