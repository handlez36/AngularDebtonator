import { Component, Inject, Type } from '@angular/core';
import { ITdDynamicElementConfig, TdDynamicElement, TdDynamicType } from '@covalent/dynamic-forms';
import { MatDialogRef } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';

import templateStr from './expense-form.component.html';

@Component({
	selector: 'app-expense-form',
	template: templateStr,
})
export class ExpenseForm {
	control: FormControl;
	elements: ITdDynamicElementConfig[] = [
		{
			name: 'date',
			label: 'Transaction Date',
			type: TdDynamicElement.Datepicker,
			required: true,
			min: new Date(2018, 1, 1).setHours(0, 0, 0, 0),
		},
		{
			name: 'retailer',
			label: 'Retailer',
			type: TdDynamicElement.Input,
			required: true,
		},
		{
			name: 'amt_charged',
			label: 'Amt Charged',
			type: TdDynamicElement.Input,
			required: true,
		},
		{
			name: 'responsible_party',
			label: 'Payee',
			type: TdDynamicElement.Select,
			required: true,
		},
		{
			name: 'card',
			label: 'Card',
			type: TdDynamicElement.Select,
			required: true,
		},
		{
			name: 'how_to_pay',
			label: 'How To Pay',
			type: TdDynamicElement.Textarea,
			required: false,
		},
	];

	constructor(public dialogRef: MatDialogRef<ExpenseForm>) {}
}
