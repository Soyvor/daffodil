import {
  Rule,
  SchematicContext,
  Tree,
  chain,
} from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import { getWorkspace } from '@schematics/angular/utility/workspace';

import { isStandaloneApp } from '../utils';
import { addDependenciesToPackageJson } from './generators/dependencies';
import { initAppProviders } from './generators/providers/init';
import { initAppRouting } from './generators/routing/init';
import { addTemplateFiles } from './generators/template-setup';
import { addDebugBarToAppTemplate } from './generators/templates/add-debug-bar';
import { NgAddOptions } from './schema';

export function ngAdd(options: NgAddOptions): Rule {
  return async (tree: Tree, context: SchematicContext) => {
    const workspace = await getWorkspace(tree);
    const project = workspace.projects.get(options.project || <string>workspace.extensions.defaultProject);

    if (!project) {
      throw new Error(`Project "${options.project}" not found.`);
    }

    const rules: Rule[] = [];
    const isStandalone = isStandaloneApp(tree, project);

    // Add dependencies to package.json
    if (!options.skipPackageJson) {
      rules.push(addDependenciesToPackageJson(options));
    }

    // Add core Daffodil configuration for demo
    rules.push(initAppProviders(options, project));

    // Setup routing
    rules.push(initAppRouting(options, project));

    // Add template files for demo components
    rules.push(addTemplateFiles(options, project));

    // Add debug bar to app component template
    rules.push(addDebugBarToAppTemplate(options, project));

    // Schedule package installation
    if (!options.skipPackageJson) {
      context.addTask(new NodePackageInstallTask());
    }

    return chain(rules);
  };
}
