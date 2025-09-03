import { normalize } from '@angular-devkit/core';
import {
  Rule,
  Tree,
  apply,
  url,
  template,
  move,
  mergeWith,
  MergeStrategy,
  forEach,
} from '@angular-devkit/schematics';

import { NgAddOptions } from '../schema';

export const addTemplateFiles = (options: NgAddOptions, project: any): Rule => (_tree: Tree) => {
  const templateSource = apply(url('./files'), [
    template({
      ...options,
    }),
    forEach((fileEntry) => {

      // Remove .template extension from files
      if (fileEntry.path.endsWith('.template')) {
        return {
          content: fileEntry.content,
          path: normalize(fileEntry.path.replace(/\.template$/, '')),
        };
      }
      return fileEntry;
    }),
    move(project.sourceRoot),
  ]);

  return mergeWith(templateSource, MergeStrategy.Overwrite);
};
