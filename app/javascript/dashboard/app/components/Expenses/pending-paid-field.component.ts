import { OnInit, Input, Component } from '@angular/core';
import templateStr from './pending-paid-field.html';
import './pending-paid-field.component.scss';

@Component({
	selector: 'app-pending-paid',
	template: templateStr,
})
export class PendingPaidField implements OnInit {
	@Input() pending: number;
	@Input() paid: number;

	ngOnInit() {}
}
