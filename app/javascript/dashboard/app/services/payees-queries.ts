import gql from 'graphql-tag';

export const retrievePayees = () => {
	return {
		query: gql`
			{
				payees {
					id
					name
				}
			}
		`,
	};
};

export const createPayee = () => {
	return {
		query: gql`
			mutation createPayee($name: String!) {
				createPayee(name: $name) {
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

export const updatePayee = () => {
	return {
		query: gql`
			mutation updatePayee($id: ID!, $name: String!) {
				updatePayee(name: $name, id: $id) {
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

export const deletePayee = () => {
	return {
		query: gql`
			mutation deletePayee($id: ID!) {
				deletePayee(id: $id) {
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
