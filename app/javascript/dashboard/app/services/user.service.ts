import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root',
})
export class UserService {
	private user: object = null;
	constructor() {}

	setUser(user) {
		this.user = user;
	}

	getUser() {
		return this.user;
	}

	getUserId() {
		return this.user ? this.user['id'] : null;
	}
}
