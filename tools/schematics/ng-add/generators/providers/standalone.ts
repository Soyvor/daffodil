import {
  Rule,
  Tree,
} from '@angular-devkit/schematics';

import { addProvidersToStandaloneApp } from '../../../utils';
import { NgAddOptions } from '../../schema';

export const addCoreProvidersToStandalone = (_options: NgAddOptions, project: any): Rule => (tree: Tree) => {
  const coreProviders = [
    'provideHttpClient()',
    'provideDaffInMemoryDriver({ apiBase: \'daff-in-memory-web-api\', passThroughUnknownRequests: true})',
    'provideDaffProductInMemoryDriver()',
    'provideDaffDevTools({}, withDriverConfig({ name: \'@daffodil/product/driver\', status: \'connected\', currentDriver: \'in-memory\', availableDrivers: [\'in-memory\', \'fake\', \'magento\'] }))',
    'provideMagentoDriver(\'https://dev-beta.lostgolfballs.com\')',
    'provideDaffProductMagentoDriver()',
    'provideDaffProductDriver(DynamicSwitchDriverService)',
  ];

  return addProvidersToStandaloneApp(tree, project, coreProviders);
};
