import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';

export const apolloClient = () => {
    return new ApolloClient({
        link: new HttpLink({
            uri: process.env.REACT_APP_PUBLIC_SUBGRAPH,
        }),
        cache: new InMemoryCache(),
    });
};
