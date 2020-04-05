import { OnInit, Component } from '@angular/core';

import { UserService } from './../../services/user.service';
import templateStr from './pay-plan-section.html';
import './pay-plan-section.scss';

@Component({
	selector: 'app-pay-plan-section',
	template: templateStr,
})
export class PayPlanSection implements OnInit {
	public plans: any[] = [];

	constructor(private userService: UserService) {}

	ngOnInit() {}

	retrievePlans() {
		const userId = this.userService.getUserId();
	}
}
