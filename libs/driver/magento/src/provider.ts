import { Provider } from '@angular/core';
import {
  from,
  InMemoryCache,
  PossibleTypesMap,
  TypePolicies,
} from '@apollo/client/core';
import { provideApollo } from 'apollo-angular';

import { provideDaffDriverHttpClientCacheService } from '@daffodil/driver';

import { createHttpLink } from './apollo/create-http-link';
import { MAGENTO_POSSIBLE_TYPES } from './apollo/possible-types';
import typePolicies from './apollo/type-policies';
import { DaffDriverHttpClientCacheMagentoService } from './graphql/cache.service';

export interface DaffMagentoDriverConfig {
  possibleTypes: PossibleTypesMap;
  typePolicies: TypePolicies;
}

/**
 * Sets up the Magento Daffodil driver configuration for Magento's GraphQl API.
 *
 * Under the hood, this is an Apollo Client configuration.
 *
 * @param domain - The Magento store domain (e.g. "https://www.my-store.com/graphql")
 */
export function provideMagentoDriver(endpoint: string, options: DaffMagentoDriverConfig = {
  possibleTypes: MAGENTO_POSSIBLE_TYPES,
  typePolicies,
}): Provider[] {
  return [
    provideApollo(() => ({
      link: from([
        createHttpLink(endpoint),
      ]),
      cache: new InMemoryCache({ typePolicies: options.typePolicies, possibleTypes: options.possibleTypes }),
    })),
    provideDaffDriverHttpClientCacheService(DaffDriverHttpClientCacheMagentoService),
  ];
}
