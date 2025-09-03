import { inject } from '@angular/core';
import { ApolloLink } from '@apollo/client/core';
import { HttpLink } from 'apollo-angular/http';

/**
 * Creates an Apollo HTTP link for GraphQL requests.
 *
 * @param url - The Shopify Storefront API endpoint URL for GraphQL requests.
 * @returns An ApolloLink instance configured with the provided URL.
 */
export function createHttpLink(url: string): ApolloLink {
  const httpLink = inject(HttpLink);
  return httpLink.create({ uri: url });
}
