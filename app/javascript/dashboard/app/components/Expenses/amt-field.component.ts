import { Component, OnInit, Input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

import './amt-field.component.scss';

@Component({
	selector: 'app-amt-field',
	template: `
		<div [class]="'amt-field flex-row ' + customClass">
			<span class="dollars">{{ splitDollarsAndCents(amt, 'd') }}</span>
			<span class="cents">{{ splitDollarsAndCents(amt, 'c') }}</span>
		</div>
	`,
})
export class AmtField implements OnInit {
	@Input() amt;
	@Input() customClass;

	constructor(private currencyPipe: CurrencyPipe) {}

	ngOnInit() {}

	splitDollarsAndCents(value, which) {
		let result = 0;

		try {
			const currency = this.currencyPipe.transform(value);
			const index = which === 'd' ? 0 : 1;
			return currency.split('.')[index];
		} catch (e) {
			return result;
		}
	}
}
