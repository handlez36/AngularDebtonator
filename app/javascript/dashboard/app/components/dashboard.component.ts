import { Component, OnInit } from '@angular/core';

import './../../styles/components/dashboard.component.scss';

@Component({
	selector: 'app-dashboard',
	template: `
		<div class="main-content">
			<div class="dashboard-left-side flex-col">
				<app-expenses></app-expenses>
			</div>
			<div class="dashboard-right-side flex-col">
				<app-archived-payplan></app-archived-payplan>
				<app-pay-plan-section></app-pay-plan-section>
			</div>
		</div>
	`,
})
export class DashboardPage {}
