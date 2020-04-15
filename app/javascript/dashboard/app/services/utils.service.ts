import { Injectable } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Currency } from './currency';
import * as moment from 'moment';

const TRUNCATE_STRING_LENGTH = 20;

@Injectable({
	providedIn: 'root',
})
export class Utils {
	private currency;

	constructor(private currencyPipe: CurrencyPipe) {
		this.currency = new Currency();
	}

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

	calculateAmtRemaining = expense => {
		const amtLockedUp = this.currency.add(expense['amtPaid'], expense['amtPending']);
		return this.currency.subtract(expense['amtCharged'], amtLockedUp);
	};

	sort = (sortBy, direction = 'ASC') => {
		return (a: any, b: any) => {
			if (direction === 'ASC') {
				if (a[sortBy] > b[sortBy]) return 1;
				if (b[sortBy] > a[sortBy]) return -1;
			} else {
				if (a[sortBy] < b[sortBy]) return 1;
				if (b[sortBy] < a[sortBy]) return -1;
			}

			return 0;
		};
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
	SHORT_MO_NO_YR: 'MMM Do',
	NUMS_ONLY: 'MM/DD/YYYY',
};
