import gql from 'graphql-tag';

export const retrieveExpenses = id => {
	return {
		query: gql`
        {
          expenses(id: ${id}) {
            id,
            date,
            retailer,
            amtCharged,
            amtPending,
            amtPaid,
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
				$userId: ID!
				$date: ISO8601DateTime!
				$retailer: String!
				$amtCharged: String!
				$responsibleParty: String!
				$card: String!
				$howToPay: String
			) {
				createExpense(
					userId: $userId
					date: $date
					retailer: $retailer
					amtCharged: $amtCharged
					responsibleParty: $responsibleParty
					card: $card
					howToPay: $howToPay
				) {
					id
				}
			}
		`,
	};
};

export const updateExpenses = () => {
	return {
		query: gql`
			mutation updateExpense(
				$userId: ID!
				$expenseId: ID!
				$date: ISO8601DateTime!
				$retailer: String!
				$amtCharged: String!
				$responsibleParty: String!
				$card: String!
				$howToPay: String
			) {
				updateExpense(
					userId: $userId
					expenseId: $expenseId
					date: $date
					retailer: $retailer
					amtCharged: $amtCharged
					responsibleParty: $responsibleParty
					card: $card
					howToPay: $howToPay
				) {
					id
				}
			}
		`,
	};
};

export const deleteExpenses = () => {
	return {
		query: gql`
			mutation deleteExpense($userId: ID!, $expenseId: [ID!]!) {
				deleteExpense(userId: $userId, expenseId: $expenseId) {
					success
				}
			}
		`,
	};
};
