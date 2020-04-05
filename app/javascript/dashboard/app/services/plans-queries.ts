import gql from 'graphql-tag';

export const retrievePlans = id => {
	return {
		query: gql`
        {
          payPlans(id: ${id}) {
            id,
            date,
            comments,
            archived
            card {
              id
              name
            }
            payments {
              id
              amt_paid
              date
              payplan {
                id
              }
              expense {
                id
              }
              card {
                id
                name
              }
              responsibleParty {
                id
                name
              }
              archived,
              how_to_pay
            }
          }
        }
      `,
	};
};
