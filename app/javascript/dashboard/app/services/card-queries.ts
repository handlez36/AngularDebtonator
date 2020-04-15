import gql from 'graphql-tag';

export const retrieveCards = () => {
	return {
		query: gql`
			{
				cards {
					id
					name
				}
			}
		`,
	};
};

export const createCard = () => {
	return {
		query: gql`
			mutation createCard($name: String!) {
				createCard(name: $name) {
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

export const updateCard = () => {
	return {
		query: gql`
			mutation updateCard($id: ID!, $name: String!) {
				updateCard(name: $name, id: $id) {
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

export const deleteCard = () => {
	return {
		query: gql`
			mutation deleteCard($id: ID!) {
				deleteCard(id: $id) {
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
