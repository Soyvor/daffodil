import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';
import { Schema as ApplicationOptions } from '@schematics/angular/application/schema';
import { Schema as WorkspaceOptions } from '@schematics/angular/workspace/schema';
import * as path from 'path';

import { NgAddOptions } from './schema';

const collectionPath = path.join(__dirname, '../collection.json');

describe('ng-add schematic - standalone apps', () => {
  const workspaceOptions: WorkspaceOptions = {
    name: 'workspace',
    newProjectRoot: 'projects',
    version: '19.0.0',
  };

  const defaultOptions: NgAddOptions = {
    project: 'test-app',
    skipPackageJson: false,
  };

  let runner: SchematicTestRunner;
  let standaloneAppTree: UnitTestTree;

  beforeEach(async () => {
    runner = new SchematicTestRunner('schematics', collectionPath);

    const standaloneAppOptions: ApplicationOptions = {
      name: 'test-app',
      inlineStyle: false,
      inlineTemplate: false,
      routing: false,
      skipTests: false,
      skipPackageJson: false,
      standalone: true, // Force standalone app
    };

    const workspaceTree = await runner.runExternalSchematic('@schematics/angular', 'workspace', workspaceOptions);
    standaloneAppTree = await runner.runExternalSchematic('@schematics/angular', 'application', standaloneAppOptions, workspaceTree);
  });

  it('should detect standalone application correctly', async () => {
    // Verify that app.module.ts does not exist in standalone app
    expect(standaloneAppTree.exists('/projects/test-app/src/app/app.module.ts')).toBe(false);
    expect(standaloneAppTree.exists('/projects/test-app/src/app/app.config.ts')).toBe(true);
  });

  it('should add core providers to app.config.ts', async () => {
    const tree = await runner.runSchematic('ng-add', defaultOptions, standaloneAppTree);
    const appConfigContent = tree.readContent('/projects/test-app/src/app/app.config.ts');

    expect(appConfigContent).toContain('provideHttpClient');
    expect(appConfigContent).toContain('provideDaffInMemoryDriver');
    expect(appConfigContent).toContain('provideDaffProductDriver');
  });

  it('should handle demo configuration with standalone app', async () => {
    const tree = await runner.runSchematic('ng-add', defaultOptions, standaloneAppTree);
    const appConfigContent = tree.readContent('/projects/test-app/src/app/app.config.ts');

    expect(appConfigContent).toContain('provideDaffInMemoryDriver');
    expect(appConfigContent).toContain('provideDaffProductDriver');
    expect(appConfigContent).toContain('DynamicSwitchDriverService');
  });

  it('should add dependencies to package.json for standalone app', async () => {
    const tree = await runner.runSchematic('ng-add', defaultOptions, standaloneAppTree);
    const packageJson = JSON.parse(tree.readContent('/package.json'));

    expect(packageJson.dependencies['@daffodil/core']).toBeDefined();
    expect(packageJson.dependencies['@daffodil/driver']).toBeDefined();
    expect(packageJson.dependencies['@daffodil/product']).toBeDefined();
  });

  it('should maintain existing standalone app structure', async () => {
    const tree = await runner.runSchematic('ng-add', defaultOptions, standaloneAppTree);

    // Original Angular standalone files should still exist
    expect(tree.exists('/projects/test-app/src/app/app.component.ts')).toBe(true);
    expect(tree.exists('/projects/test-app/src/app/app.config.ts')).toBe(true);
    expect(tree.exists('/projects/test-app/src/main.ts')).toBe(true);

    // Module file should not be created
    expect(tree.exists('/projects/test-app/src/app/app.module.ts')).toBe(false);
  });
});
