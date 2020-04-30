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

import * as Fields from './Fields';
import * as Validators from './../../utils/validators';
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
	public elements: ITdDynamicElementConfig[];
	control: FormControl;

	constructor(
		@Inject(MAT_DIALOG_DATA) public data: any,
		public dialogRef: MatDialogRef<ExpenseForm>,
		private expenseService: ExpenseService,
		private userService: UserService,
	) {
		this.mode = this.data.mode;
		this.elements = this.createFormElements(data, this.mode);
	}

	createFormElements(expense, mode): ITdDynamicElementConfig[] {
		let formElements = [];
		const amtTooLowValidation = [Validators.amtTooLowValidation(expense, mode === TABLE_MODE.EDIT)];

		formElements = [
			Fields.DateField(
				'date',
				'Transaction Date',
				mode === TABLE_MODE.ADD ? moment() : moment(expense.date),
			),
			Fields.InputField('retailer', 'Retailer', mode === TABLE_MODE.ADD ? '' : expense.retailer),
			Fields.AmountField(
				'amtCharged',
				'Amount Charged',
				mode === TABLE_MODE.ADD ? '0' : expense.amtCharged,
				amtTooLowValidation,
			),
			Fields.SelectField('card', 'Card', expense.cards, this.formatSelectedOption(expense['card'])),
			Fields.SelectField(
				'responsibleParty',
				"Who's paying",
				expense.payees,
				this.formatSelectedOption(expense['responsibleParty']),
			),
			Fields.TextAreaField('howToPay', 'How to Pay?'),
		];

		return formElements;
	}

	formatSelectedOption(element) {
		return element ? { label: element['name'], value: element['id'] } : null;
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
