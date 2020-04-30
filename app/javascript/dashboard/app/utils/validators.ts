import * as moment from 'moment';

export const amtTooLowValidation = (comparator, preCheck = true) => {
	return {
		validator: control => {
			return preCheck &&
				parseFloat(control.value) <
					parseFloat(comparator.amtPending) + parseFloat(comparator.amtPaid)
				? { tooLow: true }
				: undefined;
		},
	};
};

export const paymentAmtInvalid = (comparator, preCheck = true) => {
	return {
		validator: control => {
			return preCheck && parseFloat(control.value) > parseFloat(comparator.amtRemaining)
				? { tooHigh: true }
				: undefined;
		},
	};
};

export const paymentDateTooEarly = (comparator, preCheck = true) => {
	return {
		validator: control => {
			return preCheck && moment(control.value).isBefore(moment().startOf('day'))
				? { paymentDateTooEarly: true }
				: undefined;
		},
	};
};
