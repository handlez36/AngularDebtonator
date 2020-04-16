import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { SETUP_SAVE_STATES } from '../../utils/constants';
import './setup-manage-footer.component.scss';

@Component({
	selector: 'app-setup-manage-footer',
	template: `
		<div class="item-list setup-manage-footer flex-row">
			<div class="item-card add-new flex-center" (click)="addItem.emit()">
				<mat-icon *ngIf="itemStatus === 'IDLE' || mode === 'EDIT'" class="add-item-button"
					>add</mat-icon
				>
				<div class="item-text">{{ displayAddItem() }}</div>
			</div>
			<div
				*ngFor="let item of items"
				class="item-card flex-center"
				[id]="item.id"
				(click)="selectItem.emit(item.id)"
			>
				<ng-template
					*ngIf="shouldShow('SAVING', item)"
					class="update-name-loader"
					[tdLoading]="item.name + '-loader'"
					tdLoadingColor="warn"
					[tdLoadingUntil]="itemStatus !== 'SAVING'"
				></ng-template>
				<mat-icon *ngIf="shouldShow('SAVED', item)" class="saved-status success">check</mat-icon>
				<mat-icon *ngIf="shouldShow('ERROR', item)" class="saved-status error">error</mat-icon>
				<div class="item-text">{{ displayItem(item) }}</div>
			</div>
		</div>
	`,
})
export class SetupManageFooter implements OnInit {
	@Input() items: any[];
	@Input() selectedItem: any;
	@Input() updatedName: string;
	@Input() itemStatus: string;
	@Input() mode: string;
	@Output() selectItem = new EventEmitter();
	@Output() addItem = new EventEmitter();

	constructor() {}

	ngOnInit() {}

	displayItem(item) {
		if (
			this.selectedItem['id'] !== item['id'] ||
			this.itemStatus === SETUP_SAVE_STATES.IDLE ||
			this.itemStatus === SETUP_SAVE_STATES.CANCEL
		) {
			return item['name'];
		} else if (this.itemStatus === SETUP_SAVE_STATES.UPDATING) {
			return this.updatedName;
		} else {
			return SETUP_SAVE_STATES[this.itemStatus];
		}
	}

	displayAddItem() {
		if (this.mode !== 'ADD') return 'Add new';

		if (
			this.itemStatus === SETUP_SAVE_STATES.IDLE ||
			this.itemStatus === SETUP_SAVE_STATES.CANCEL
		) {
			return 'Add new';
		} else if (this.itemStatus === SETUP_SAVE_STATES.UPDATING) {
			return this.updatedName;
		} else {
			return SETUP_SAVE_STATES[this.itemStatus];
		}
	}

	shouldShow(status, item) {
		return this.itemStatus === status && this.selectedItem['id'] === item['id'];
	}
}
