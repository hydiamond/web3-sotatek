import { gql } from '@apollo/client';
import { apolloClient } from './client';

class UserHistory {
    async getMarketDetail(account) {
        return await apolloClient().query({
            query: gql`
                {
                    userHistories(where : {
                        user : "${account}"
                    }) {
                        id
                        type
                        user
                        amount
                        timestamp
                    }
                }
            `,
        });
    }
}

export const userHistoryApollo = new UserHistory();
