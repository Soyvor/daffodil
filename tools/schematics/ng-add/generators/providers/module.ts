import {
  Rule,
  Tree,
} from '@angular-devkit/schematics';

import { addProvidersToModule } from '../../../utils';
import { NgAddOptions } from '../../schema';

export const addCoreImports = (_options: NgAddOptions, project: any): Rule => (tree: Tree) => {
  const appModulePath = `${project.sourceRoot}/app/app.module.ts`;

  const coreProviders = [
    'provideHttpClient()',
    'provideDaffInMemoryDriver({ apiBase: \'daff-in-memory-web-api\', passThroughUnknownRequests: true})',
    'provideDaffProductInMemoryDriver()',
    'provideDaffProductDriver(DynamicSwitchDriverService)',
    'provideDaffDevTools({}, withDriverConfig({ name: \'@daffodil/product/driver\', status: \'connected\', currentDriver: \'in-memory\', availableDrivers: [\'in-memory\', \'fake\', \'magento\'] }))',
    'provideMagentoDriver(\'https://dev-beta.lostgolfballs.com\')',
    'provideDaffProductMagentoDriver()',
  ];

  // Add providers to the providers array
  return addProvidersToModule(tree, appModulePath, coreProviders);
};
