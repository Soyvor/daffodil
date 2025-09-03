import { NgModule } from '@angular/core';

import { provideDaffDriverHttpClientCacheService } from '@daffodil/driver';

import { DaffDriverHttpClientCacheMagentoService } from './graphql/cache.service';

/**
 * @deprecated in favor of {@link provideMagentoDriver}
 */
@NgModule({
  providers: [
    provideDaffDriverHttpClientCacheService(DaffDriverHttpClientCacheMagentoService),
  ],
})
export class DaffDriverMagentoModule {}
