import { OnInit, Input, Component } from '@angular/core';
import * as moment from 'moment';
import templateStr from './date-field.component.html';
import './date-field.component.scss';

@Component({
	selector: 'app-date-field',
	template: templateStr,
})
export class DateField implements OnInit {
	@Input() date: string;

	public month: string = '';
	public day: string = '';
	public year: string = '';

	ngOnInit() {
		try {
			this.month = moment(this.date).format('MMM');
			this.day = moment(this.date).format('DD');
			this.year = moment(this.date).format('YYYY');
		} catch (e) {
			this.month = moment().format('MMM');
			this.day = moment().format('DD');
			this.year = moment().format('YYYY');
		}
	}
}
