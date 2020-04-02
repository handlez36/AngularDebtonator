import { Injectable } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import * as moment from 'moment';

const TRUNCATE_STRING_LENGTH = 20;

@Injectable({
	providedIn: 'root',
})
export class Utils {
	constructor(private currencyPipe: CurrencyPipe) {}

	currencyTransform = value => {
		try {
			const currency = this.currencyPipe.transform(value);
			return currency;
		} catch (e) {
			return value;
		}
	};

	truncatedStrTransform = (value, length = null) => {
		const lengthToTruncate = length || TRUNCATE_STRING_LENGTH;
		return value.length >= lengthToTruncate ? value.slice(0, lengthToTruncate - 4) : value;
	};

	dateTransform = date => {
		try {
			const formattedate = moment(date).format('MM/DD/YYYY');
			return formattedate;
		} catch (e) {
			return moment().format('MM/DD/YYYY');
		}
	};
}
