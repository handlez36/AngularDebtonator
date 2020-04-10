import gql from 'graphql-tag';

export const retrieveExpenses = () => {
	return {
		query: gql`
			{
				expenses {
					id
					date
					retailer
					amtCharged
					amtPending
					amtPaid
					responsibleParty {
						id
						name
					}
					card {
						id
						name
					}
					howToPay
				}
			}
		`,
	};
};

export const createExpense = () => {
	return {
		query: gql`
			mutation createExpense(
				$date: ISO8601DateTime!
				$retailer: String!
				$amtCharged: String!
				$responsibleParty: String!
				$card: String!
				$howToPay: String
			) {
				createExpense(
					date: $date
					retailer: $retailer
					amtCharged: $amtCharged
					responsibleParty: $responsibleParty
					card: $card
					howToPay: $howToPay
				) {
					id
					errors {
						path
						message
					}
				}
			}
		`,
	};
};

export const updateExpenses = () => {
	return {
		query: gql`
			mutation updateExpense(
				$expenseId: ID!
				$date: ISO8601DateTime!
				$retailer: String!
				$amtCharged: String!
				$responsibleParty: String!
				$card: String!
				$howToPay: String
			) {
				updateExpense(
					expenseId: $expenseId
					date: $date
					retailer: $retailer
					amtCharged: $amtCharged
					responsibleParty: $responsibleParty
					card: $card
					howToPay: $howToPay
				) {
					id
					errors {
						path
						message
					}
				}
			}
		`,
	};
};

export const deleteExpenses = () => {
	return {
		query: gql`
			mutation deleteExpense($expenseId: [ID!]!) {
				deleteExpense(expenseId: $expenseId) {
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
