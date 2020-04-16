import { Component, OnInit } from '@angular/core';

import { SETUP_ITEM_TYPE } from './../utils/constants';
import templateString from './setup-page.component.html';
import './setup-page.component.scss';

@Component({
	selector: 'app-setup-page',
	template: templateString,
})
export class SetupPage implements OnInit {
	public ITEM_TYPE = SETUP_ITEM_TYPE;

	constructor() {}

	ngOnInit() {}
}
