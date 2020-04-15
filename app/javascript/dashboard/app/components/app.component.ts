import { Component, OnInit } from '@angular/core';

import { UserService } from './../services/user.service';
import templateString from './app.component.html';

@Component({
	selector: 'app-wrapper',
	template: templateString,
})
export class App implements OnInit {
	user: object = {};
	name: string = '';
	email: string = '';

	constructor(private userService: UserService) {}

	ngOnInit() {
		console.log('DashboardComponent.js -- Initializing dashboard component!!!');

		this.user = this.getCurrentUser();
		this.userService.setUser(this.user);
		if (this.user['first_name']) {
			this.name = `${this.user['first_name']} ${this.user['last_name']}}`;
		}

		if (this.user['email']) {
			this.email = this.user['email'];
		}
	}

	/**
	 * Work around to get current user attribute passed from Rails after login.
	 */
	getCurrentUser() {
		const dashboardComponent = document.querySelector('app-wrapper');

		console.log('Dashboard Component: ', dashboardComponent);
		if (dashboardComponent) {
			const attributes = dashboardComponent.getAttribute('data-user');
			return JSON.parse(attributes);
		}

		return {};
	}
}
