import { Provider } from '@angular/core';

import { provideDaffInMemoryBackends } from '@daffodil/driver/in-memory';
import { provideDaffProductDriver } from '@daffodil/product/driver';
import {
  DaffDefaultProductFactory,
  provideDaffProductExtraFactoryTypes,
} from '@daffodil/product/testing';

import {
  DaffInMemoryBackendProductService,
  DaffInMemoryProductService,
} from '../public_api';

/**
 * Provides the Daffodil product in-memory driver and its dependencies.
 */
export const provideDaffProductInMemoryDriver = (): Provider[] => [
  DaffInMemoryProductService,
  provideDaffProductDriver(DaffInMemoryProductService),
  provideDaffProductExtraFactoryTypes(DaffDefaultProductFactory),
  provideDaffInMemoryBackends(DaffInMemoryBackendProductService),
];
