import * as money from 'money-math';

export class Currency {
	constructor() {}

	public add(value1: any, value2: any) {
		const formattedVal1 = money.floatToAmount(value1);
		const formattedVal2 = money.floatToAmount(value2);

		return money.add(formattedVal1, formattedVal2);
	}

	public subtract(value1: any, value2: any) {
		const formattedVal1 = money.floatToAmount(value1);
		const formattedVal2 = money.floatToAmount(value2);

		return money.subtract(formattedVal1, formattedVal2);
	}
}
