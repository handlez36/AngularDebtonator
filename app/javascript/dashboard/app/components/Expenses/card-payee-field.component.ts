import { OnInit, Input, Component } from '@angular/core';
import templateStr from './card-payee-field.component.html';
import './card-payee-field.component.scss';

@Component({
	selector: 'app-card-payee',
	template: templateStr,
})
export class CardPayeeField implements OnInit {
	@Input() card: string;
	@Input() payee: string;

	ngOnInit() {}
}
