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

export const createPaymentsOld = () => {
	return {
		query: gql`
			mutation createPayments(
				$expenseId: [ID!]!
				$date: [ISO8601DateTime!]!
				$amtPaid: [String!]!
				$responsibleParty: [String!]!
				$howToPay: [String]
			) {
				createPayment(
					expenseId: $expenseId
					date: $date
					amtPaid: $amtPaid
					responsibleParty: $responsibleParty
					howToPay: $howToPay
				) {
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
