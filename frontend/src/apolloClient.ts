// Graphql Client
import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

const httpLink = createHttpLink({
  uri: "http://localhost:3000/graphql",
});

// prevContextには、一つ前のLinkの情報が入っている
const authLink = setContext((_, prevContext) => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      ...prevContext.headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(), // Apollo Clientのキャッシュの設定
});

export default client;
