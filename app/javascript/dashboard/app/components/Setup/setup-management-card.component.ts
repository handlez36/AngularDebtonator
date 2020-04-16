import { Component, OnInit, Input } from '@angular/core';

import { SETUP_SAVE_STATES, SETUP_UPDATE_MODE } from '../../utils/constants';
import { CardService } from '../../services/card.service';
import { PayeeService } from '../../services/payees.service';
import { SETUP_ITEM_TYPE } from './../../utils/constants';
import templateString from './setup-management-card.component.html';
import './setup-management-card.component.scss';

@Component({
	selector: 'app-setup-manage-section',
	template: templateString,
})
export class SetupManagementCard implements OnInit {
	@Input() type: string;

	public items: any[] = [];
	public showContent: boolean = false;
	public selectedItem: any = {};
	public mode: string = '';
	public updatedItemName: string = '';
	public footerStatus: string = 'IDLE';

	constructor(private cardService: CardService, private payeeService: PayeeService) {}

	ngOnInit() {
		const apiInterface =
			this.type === SETUP_ITEM_TYPE.CARD
				? this.cardService.getCards()
				: this.payeeService.getPayees();
		this.retrieveItems(apiInterface);
	}

	retrieveItems(apiInterface) {
		apiInterface.subscribe(
			response => {
				if (response.data && response.data[this.type]) {
					this.items = response.data[this.type];
				}
			},
			error => console.log('Error retrieving data'),
			() => console.log('Finished retrieving data'),
		);
	}

	onStartAdd() {
		this.toggleShowContent();
		this.mode = SETUP_UPDATE_MODE.ADD;
	}

	onItemSelect(id) {
		if (id === this.selectedItem['id']) {
			this.showContent = false;
			this.selectedItem = {};
		} else {
			this.showContent = true;
			this.selectedItem = this.findItem(id);
		}
		this.mode = SETUP_UPDATE_MODE.EDIT;
	}

	findItem(id) {
		const matches = this.items.filter(item => item.id === id);
		return matches && matches[0] ? matches[0] : {};
	}

	onUpdateItemName(name) {
		this.updatedItemName = name;
		this.footerStatus = SETUP_SAVE_STATES.UPDATING;
	}

	onItemStatusUpdate(status) {
		if (status !== SETUP_SAVE_STATES.CANCEL && status !== SETUP_SAVE_STATES.IDLE) {
			this.footerStatus = status;
		} else {
			this.resetView();
		}
	}

	resetView() {
		this.footerStatus = SETUP_SAVE_STATES.IDLE;
		this.showContent = false;
		this.selectedItem = {};
		this.mode = '';
		this.updatedItemName = '';
	}

	toggleShowContent() {
		this.showContent = !this.showContent;
	}
}
