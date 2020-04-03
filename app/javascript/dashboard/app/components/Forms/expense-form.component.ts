import { OnInit, Component, ViewChild, Input, Inject, Type } from '@angular/core';
import {
	ITdDynamicElementConfig,
	TdDynamicElement,
	TdDynamicType,
	TdDynamicFormsComponent,
	ITdDynamicElementValidator,
} from '@covalent/dynamic-forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AbstractControl, FormControl } from '@angular/forms';

import templateStr from './expense-form.component.html';

@Component({
	selector: 'app-expense-form',
	template: templateStr,
})
export class ExpenseForm {
	@ViewChild(TdDynamicFormsComponent, { static: true }) form: TdDynamicFormsComponent;

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
			type: TdDynamicType.Number,
			min: 0.0,
			max: 99999.0,
			required: true,
			validators: [
				{
					validator: (control: AbstractControl) => {
						try {
							const parts = control.value.split('.');
							if (parts && parts[1]) {
								return parts[1].length > 2 ? { currencyFormat: true } : undefined;
							}
							return undefined;
						} catch (e) {
							return undefined;
						}
					},
				},
			],
		},
		{
			name: 'responsible_party',
			label: 'Payee',
			type: TdDynamicElement.Select,
			selections: this.data.payees,
			default: this.data.payees[0],
			required: true,
		},
		{
			name: 'card',
			label: 'Card',
			type: TdDynamicElement.Select,
			selections: this.data.cards,
			default: this.data.cards[0],
			required: true,
		},
		{
			name: 'how_to_pay',
			label: 'How To Pay',
			type: TdDynamicElement.Textarea,
			required: false,
		},
	];

	constructor(
		public dialogRef: MatDialogRef<ExpenseForm>,
		@Inject(MAT_DIALOG_DATA) public data: any,
	) {}

	isFormInvalid() {
		return this.form && !this.form.valid;
	}

	onAdd() {
		if (!this.isFormInvalid()) {
			const {
				value: { date, retailer, amt_charged, responsible_party, card, how_to_pay } = {},
			} = this.form;
			const response = {
				date,
				retailer,
				amt_charged,
				responsible_party,
				card,
				how_to_pay,
			};
			console.log('Prepped response: ', response);
		}
	}

	onCancel() {
		this.dialogRef.close();
	}
}
