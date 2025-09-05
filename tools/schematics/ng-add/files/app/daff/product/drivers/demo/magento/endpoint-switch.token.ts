import {
  inject,
  InjectionToken,
} from '@angular/core';
import { UriFunction } from '@apollo/client/core';

import { DaffDevToolsConfigService } from '@daffodil/dev-tools';

export const DEMO_MAGENTO_ENDPOINT_SWITCH = new InjectionToken<string | UriFunction>('DEMO_MAGENTO_ENDPOINT_SWITCH', {
  factory: () =>{
    const devTools = inject(DaffDevToolsConfigService);

    return () => {
      const config = devTools.getDriverConfig('@daffodil/product/driver');
      let endpoint = '';
      config.subscribe((data) => {
        endpoint = data?.currentDriver.properties['baseUrl'] ?? endpoint;
      });
      return endpoint;
    };
  },
  providedIn: 'root',
});
