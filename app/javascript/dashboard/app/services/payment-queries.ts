import gql from 'graphql-tag';

export const createPayments = () => {
	return {
		query: gql`
			mutation createPayments($input: [PaymentAttributes]!) {
				createPayment(input: $input) {
					success
					errors {
						path
						message
					}
				}
			}
		`,
	};
};

export const deletePayment = () => {
	return {
		query: gql`
			mutation deletePayment($id: [ID!]!) {
				deletePayment(id: $id) {
					success
					errors {
						path
						message
					}
				}
			}
		`,
	};
};
