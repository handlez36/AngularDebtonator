import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import templateString from './archived-plan-detail.component.html';
import './archived-plan-detail.component.scss';

@Component({
	selector: 'app-archived-plan-detail',
	template: templateString,
})
export class ArchivedPlanDetail implements OnInit {
	// constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
	public panelOpenState: boolean = false;

	constructor() {}

	ngOnInit() {
		// console.log(`Selected id is ${this.data['id']}`);
	}
}
