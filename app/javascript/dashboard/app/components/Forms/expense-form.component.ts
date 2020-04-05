import { Component, ViewChild, Inject } from '@angular/core';
import {
	ITdDynamicElementConfig,
	TdDynamicElement,
	TdDynamicType,
	TdDynamicFormsComponent,
} from '@covalent/dynamic-forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AbstractControl, FormControl } from '@angular/forms';
import * as moment from 'moment';

import { ExpenseService } from './../../services/expense.service';
import { UserService } from './../../services/user.service';
import { TABLE_MODE } from '../../utils/constants';
import templateStr from './expense-form.component.html';

@Component({
	selector: 'app-expense-form',
	template: templateStr,
})
export class ExpenseForm {
	@ViewChild(TdDynamicFormsComponent, { static: true }) form: TdDynamicFormsComponent;

	public TABLE_MODE = TABLE_MODE;
	public mode: TABLE_MODE;
	control: FormControl;
	elements: ITdDynamicElementConfig[] = [
		{
			name: 'date',
			label: 'Transaction Date',
			type: TdDynamicElement.Datepicker,
			required: true,
			min: new Date(2018, 1, 1).setHours(0, 0, 0, 0),
			default: moment(this.data['date']),
		},
		{
			name: 'retailer',
			label: 'Retailer',
			type: TdDynamicElement.Input,
			required: true,
			default: this.data['retailer'],
		},
		{
			name: 'amtCharged',
			label: 'Amt Charged',
			type: TdDynamicType.Number,
			min: 0.0,
			max: 99999.0,
			required: true,
			default: parseFloat(this.data['amtCharged']),
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
			name: 'responsibleParty',
			label: 'Payee',
			type: TdDynamicElement.Select,
			selections: this.optionSelections(this.data.payees),
			default:
				this.optionSelections(this.data.payees)[0] &&
				this.optionSelections(this.data.payees)[0]['value'],
			required: true,
		},
		{
			name: 'card',
			label: 'Card',
			type: TdDynamicElement.Select,
			selections: this.optionSelections(this.data.cards),
			default:
				this.optionSelections(this.data.cards)[0] &&
				this.optionSelections(this.data.cards)[0]['value'],
			required: true,
		},
		{
			name: 'howToPay',
			label: 'How To Pay',
			type: TdDynamicElement.Textarea,
			required: false,
			default: this.data['howToPay'],
		},
	];

	constructor(
		public dialogRef: MatDialogRef<ExpenseForm>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private expenseService: ExpenseService,
		private userService: UserService,
	) {
		this.mode = this.data.mode;
		console.log('Retailer: ', this.data['retailer']);
		console.log('Retailer: ', this.data);
	}

	optionSelections(data) {
		const options: any[] = [];

		data.forEach(p => options.push({ label: p['name'], value: p['id'] }));

		return options.sort((a, b) => {
			if (a['label'] < b['label']) return -1;
			if (b['label'] < a['label']) return 1;
			return 0;
		});
	}

	isFormInvalid() {
		return this.form && !this.form.valid;
	}

	onAdd() {
		const userId = this.userService.getUserId();
		if (!this.isFormInvalid()) {
			const {
				value: { date, retailer, amtCharged, responsibleParty, card, howToPay } = {},
			} = this.form;
			const response = {
				date,
				retailer,
				amtCharged,
				responsibleParty,
				card,
				howToPay,
			};
			this.expenseService.createExpense(userId, response);
		}
	}

	onCancel() {
		this.dialogRef.close();
	}
}
