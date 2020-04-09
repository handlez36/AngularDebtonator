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

	dateTransform = (date, format = DATE_FORMATS.NUMS_ONLY) => {
		try {
			const formattedate = moment(date).format(format);
			return formattedate;
		} catch (e) {
			return moment().format(format);
		}
	};
}

export class ApiUtils {
	constructor() {}

	formatErrors(errors) {
		return errors.map(error => {
			const { path = [], message } = error;
			const source = path && path[0] === 'attributes' ? `${path[1] ? path[1] : ''} field ` : '';
			return `${source}${message}`;
		});
	}
}

export const DATE_FORMATS = {
	GRAPHQL: 'YYYY-MM-DDThh:mm:ssZ',
	SHORT_MO: 'MMM Do, YYYY',
	NUMS_ONLY: 'MM/DD/YYYY',
};
