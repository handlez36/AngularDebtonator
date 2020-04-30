import { Component, ViewChildren, Inject, QueryList } from '@angular/core';
import { TdDynamicFormsComponent } from '@covalent/dynamic-forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import * as moment from 'moment';

import * as Fields from './Fields';
import { Currency } from './../../services/currency';
import { PaymentService } from './../../services/payment.service';
import { Utils, ApiUtils, DATE_FORMATS } from './../../services/utils.service';
import * as Validators from './../../utils/validators';
import templateStr from './payment-form.component.html';
import './payment-form.component.scss';

@Component({
	selector: 'app-payment-form',
	template: templateStr,
})
export class PaymentForm {
	@ViewChildren(TdDynamicFormsComponent) forms!: QueryList<TdDynamicFormsComponent>;

	public expenses: any[] = [];
	public currency;
	public inputData: any = {};
	public formElements: any = {};
	public formElementKeys: string[] = [];
	public errors: String[] = [];
	public allDatePickerOpen: boolean = false;
	public globalDate: string = '';
	control: FormControl;

	constructor(
		@Inject(MAT_DIALOG_DATA) public data: any,
		public dialogRef: MatDialogRef<PaymentForm>,
		private paymentService: PaymentService,
		private utils: Utils,
		private apiUtils: ApiUtils,
	) {
		this.currency = new Currency();
		this.inputData = data;
		this.formElements = this.createFormElements(this.inputData);
		this.formElementKeys = Object.keys(this.formElements);
	}

	ngAfterViewInit() {
		const expenseIdFIelds = document.querySelectorAll(
			'.payment-form .td-dynamic-element-wrapper:first-child',
		);

		if (expenseIdFIelds) {
			expenseIdFIelds.forEach(field => field.classList.add('hidden'));
		}
	}

	createFormElements = data => {
		const { expenses } = data;
		return expenses.reduce((formElements, expense) => {
			const amtRemainingValidation = Validators.paymentAmtInvalid(expense);
			const paymentDateValidation = Validators.paymentDateTooEarly(expense);

			if (!formElements[expense.id]) formElements[expense.id] = [];

			formElements[expense.id] = [
				Fields.HiddenInputField('expenseId', '', expense.id),
				Fields.DateField('date', 'Payment Date', moment(), [paymentDateValidation]),
				Fields.AmountField('amtPaid', 'Pay How Much', expense.amtRemaining, [
					amtRemainingValidation,
				]),
				Fields.SelectField(
					'responsibleParty',
					"Who's paying",
					data.payees,
					this.formatSelectedOption(expense['responsibleParty']),
				),
				Fields.TextAreaField('howToPay', 'How to Pay?'),
			];
			return formElements;
		}, {});
	};

	formatSelectedOption(element) {
		return element ? { label: element['name'], value: element['id'] } : null;
	}

	expenseLabel(id) {
		const matches = this.inputData.expenses.filter(item => item.id === id);
		if (!matches || matches.length < 0) return '';

		const expense = matches[0];
		return `Payment for ${expense.retailer} (${this.utils.dateTransform(
			expense.date,
			DATE_FORMATS.SHORT_MO,
		)})`;
	}

	calculateAmtRemaining(id) {
		const matches = this.inputData.expenses.filter(item => item.id === id);
		if (!matches || matches.length < 0) return '';

		const expense = matches[0];
		return `${this.currency.subtract(expense.amtRemaining, 0)} left!!!`;
	}

	setGlobalDate(event) {
		const { value } = event;
		this.globalDate = this.utils.dateTransform(value, DATE_FORMATS.NUMS_ONLY);
	}

	useGlobaleDate() {
		this.allDatePickerOpen = !this.allDatePickerOpen;

		if (this.allDatePickerOpen) {
			const keys = Object.keys(this.formElements);
			keys.forEach(key => {
				const dateObj = this.formElements[key].filter(el => el.name === 'date')[0];
				dateObj.default = moment(this.globalDate);
			});
			this.forms.forEach(form => form.refresh());
		}
	}

	isFormInvalid() {
		if (!this.forms) return false;

		const allFormsValid = this.forms.reduce((valid, form) => valid && form.valid, true);
		return !allFormsValid;
	}

	onCancel() {
		this.dialogRef.close();
	}

	onPay() {
		const values = this.forms
			.map(form => form.value)
			.map(vals => ({ ...vals, amtPaid: `${vals['amtPaid']}` }));

		this.paymentService.createPayments(values).subscribe({
			next: ({ data: { createPayment: response } }) => this.handleResponse(response),
			error: err => (this.errors = ['Error creating payment: ' + err]),
		});
	}

	handleResponse(response) {
		if (response.success === 'success') {
			this.dialogRef.close();
		} else if (response.errors) {
			this.errors = this.apiUtils.formatErrors(response.errors);
		}
	}
}
