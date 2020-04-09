import {
	ITdDynamicElementConfig,
	TdDynamicElement,
	TdDynamicType,
	TdDynamicFormsComponent,
} from '@covalent/dynamic-forms';
import { AbstractControl } from '@angular/forms';

export const AmountField = (name, label, defaultVal) => ({
	name,
	label,
	default: parseFloat(defaultVal),
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
});

export const DateField = (name, label, defaultVal) => ({
	name,
	label,
	// default: moment(this.data['date']),
	default: defaultVal,
	type: TdDynamicElement.Datepicker,
	required: true,
	min: new Date(2018, 1, 1).setHours(0, 0, 0, 0),
});

export const InputField = (name, label, defaultVal = '') => ({
	name,
	label,
	type: TdDynamicElement.Input,
	required: true,
	default: defaultVal,
	// default: this.data['retailer'],
});

export const HiddenInputField = (name, label, defaultVal) => ({
	name,
	label,
	default: defaultVal,
	type: TdDynamicElement.Input,
	required: false,
});

export const SelectField = (name, label, selections) => ({
	name,
	label,
	default: optionSelections(selections)[0] && optionSelections(selections)[0]['value'],
	type: TdDynamicElement.Select,
	selections: optionSelections(selections),
	required: true,
});

export const TextAreaField = (name, label, defaultVal = null) => ({
	name,
	label,
	// default: this.data['howToPay'],
	default: defaultVal || '',
	type: TdDynamicElement.Textarea,
	required: false,
});

const optionSelections = data => {
	const options: any[] = [];

	data.forEach(p => options.push({ label: p['name'], value: p['id'] }));
	return options.sort((a, b) => {
		if (a['label'] < b['label']) return -1;
		if (b['label'] < a['label']) return 1;
		return 0;
	});
};
