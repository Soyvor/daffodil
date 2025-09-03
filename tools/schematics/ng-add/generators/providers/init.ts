import {
  Rule,
  SchematicContext,
  Tree,
} from '@angular-devkit/schematics';

import { addCoreImports } from './module';
import { addCoreProvidersToStandalone } from './standalone';
import { isStandaloneApp } from '../../../utils';
import { NgAddOptions } from '../../schema';

export const initAppProviders = (options: NgAddOptions, project: any): Rule => (tree: Tree, context: SchematicContext) => {
  const isStandalone = isStandaloneApp(tree, project);

  if (isStandalone) {
    return addCoreProvidersToStandalone(options, project)(tree, context);
  } else {
    return addCoreImports(options, project)(tree, context);
  }
};
