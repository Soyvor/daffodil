import {
  Tree,
  Rule,
} from '@angular-devkit/schematics';
import {
  addPackageJsonDependency,
  NodeDependency,
  NodeDependencyType,
} from '@schematics/angular/utility/dependencies';

import { NgAddOptions } from '../schema';

export function addDependenciesToPackageJson(options: NgAddOptions): Rule {
  return (tree: Tree) => {
    const dependencies: NodeDependency[] = [
      { type: NodeDependencyType.Default, version: '^0.87.0', name: '@daffodil/core' },
      { type: NodeDependencyType.Default, version: '^0.87.0', name: '@daffodil/driver' },
      { type: NodeDependencyType.Default, version: '^0.87.0', name: '@daffodil/product' },
      { type: NodeDependencyType.Default, version: 'file:../../graycore/daffodil/dist/dev-tools/daffodil-dev-tools-0.0.0-PLACEHOLDER.tgz', name: '@daffodil/dev-tools' },
    ];

    dependencies.forEach(dependency => {
      addPackageJsonDependency(tree, dependency);
    });

    return tree;
  };
}
