import { TdDynamicElement, TdDynamicType } from '@covalent/dynamic-forms';
import { AbstractControl } from '@angular/forms';

export const AmountField = (name, label, defaultVal, additionalValidations) => {
	let validators = [
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
	];

	if (additionalValidations) {
		validators = validators.concat(additionalValidations);
	}

	return {
		name,
		label,
		default: parseFloat(defaultVal),
		type: TdDynamicType.Number,
		min: 0.0,
		max: 99999.0,
		required: true,
		validators,
	};
};

export const DateField = (name, label, defaultVal, additionalValidations = null) => ({
	name,
	label,
	default: defaultVal,
	type: TdDynamicElement.Datepicker,
	required: true,
	min: new Date(2018, 1, 1).setHours(0, 0, 0, 0),
	validators: additionalValidations || null,
});

export const InputField = (name, label, defaultVal = '') => ({
	name,
	label,
	type: TdDynamicElement.Input,
	required: true,
	default: defaultVal,
});

export const HiddenInputField = (name, label, defaultVal) => ({
	name,
	label,
	default: defaultVal,
	type: TdDynamicElement.Input,
	required: false,
});

export const SelectField = (name, label, selections, selected) => ({
	name,
	label,
	default: getDefaultSelectionIndex(selected, optionSelections(selections), !selected),
	type: TdDynamicElement.Select,
	selections: optionSelections(selections),
	required: true,
});

export const TextAreaField = (name, label, defaultVal = null) => ({
	name,
	label,
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

const getDefaultSelectionIndex = (selected, list, selectFirst = false) => {
	if (selectFirst) return list[0].value;

	const index = list.findIndex(p => p.label === selected.label);
	return index > 0 ? list[index].value : list[0].value;
};
