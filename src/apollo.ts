import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  gql
} from "@apollo/client";

export const apollo = new ApolloClient({
  uri: 'https://graphqlpokemon.favware.tech/',
  cache: new InMemoryCache()
});
