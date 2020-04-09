import gql from 'graphql-tag';

export const retrievePlans = () => {
	return {
		query: gql`
			{
				payPlans {
					id
					date
					comments
					archived
					card {
						id
						name
					}
					payments {
						id
						amtPaid
						date
						payplan {
							id
						}
						expense {
							id
							retailer
							date
						}
						card {
							id
							name
						}
						responsibleParty {
							id
							name
						}
						archived
						howToPay
					}
				}
			}
		`,
	};
};
