import { Component, ViewChild, Inject, Output, EventEmitter } from '@angular/core';
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
import './expense-form.component.scss';

@Component({
	selector: 'app-expense-form',
	template: templateStr,
})
export class ExpenseForm {
	@ViewChild(TdDynamicFormsComponent, { static: true }) form: TdDynamicFormsComponent;

	public TABLE_MODE = TABLE_MODE;
	public mode: TABLE_MODE;
	public errors: String[] = [];
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
		@Inject(MAT_DIALOG_DATA) public data: any,
		public dialogRef: MatDialogRef<ExpenseForm>,
		private expenseService: ExpenseService,
		private userService: UserService,
	) {
		this.mode = this.data.mode;
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

	onManage(action, row = null) {
		const userId = this.userService.getUserId();
		if (!this.isFormInvalid()) {
			if (action === TABLE_MODE.ADD) {
				this.expenseService.createExpense(userId, this.form.value).subscribe({
					next: ({ data: { createExpense: expense } }) => this.handleResponse(expense),
					error: err => (this.errors = ['Error creating expense: ' + err]),
				});
			} else {
				this.expenseService.updateExpense(userId, this.data['id'], this.form.value).subscribe({
					next: ({ data: { updateExpense: expense } }) => this.handleResponse(expense),
					error: err => (this.errors = ['Error updating expense: ' + err]),
				});
			}
		}
	}

	handleResponse(expense) {
		console.log('Expense: ', expense);
		if (expense.id) {
			this.dialogRef.close();
		} else if (expense.errors) {
			this.errors = this.formatErrors(expense.errors);
		}
	}

	formatErrors(errors) {
		return errors.map(error => {
			const { path = [], message } = error;
			const source = path && path[0] === 'attributes' ? `${path[1] ? path[1] : ''} field ` : '';
			return `${source}${message}`;
		});
	}

	onCancel() {
		this.dialogRef.close();
	}
}
