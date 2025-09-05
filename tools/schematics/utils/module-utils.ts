import { Tree } from '@angular-devkit/schematics';
import * as ts from '@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript';
import { insertImport } from '@schematics/angular/utility/ast-utils';
import { InsertChange } from '@schematics/angular/utility/change';

export function addImportsToModule(tree: Tree, modulePath: string, imports: string[]): Tree {
  const moduleSource = tree.read(modulePath);
  if (!moduleSource) {
    throw new Error(`Module file ${modulePath} not found`);
  }

  const sourceText = moduleSource.toString();
  const source = ts.createSourceFile(modulePath, sourceText, ts.ScriptTarget.Latest, true);

  const changes: InsertChange[] = [];

  imports.forEach(importName => {
    const packageName = getPackageForImport(importName);
    const change = insertImport(source, modulePath, importName, packageName);
    if (change instanceof InsertChange) {
      changes.push(change);
    }
  });

  // Apply changes to the file
  let updatedContent = sourceText;
  changes.reverse().forEach(change => {
    updatedContent = updatedContent.slice(0, change.pos) + change.toAdd + updatedContent.slice(change.pos);
  });

  tree.overwrite(modulePath, updatedContent);
  return tree;
}

export function addProvidersToModule(tree: Tree, modulePath: string, providers: string[]): Tree {
  const moduleSource = tree.read(modulePath);
  if (!moduleSource) {
    throw new Error(`Module file ${modulePath} not found`);
  }

  const sourceText = moduleSource.toString();
  const source = ts.createSourceFile(modulePath, sourceText, ts.ScriptTarget.Latest, true);

  // Add import statements for providers
  const importChanges: InsertChange[] = [];
  providers.forEach(provider => {
    const providerNames = extractProviderNames(provider);
    providerNames.forEach(providerName => {
      const packageName = getPackageForProvider(providerName);
      const change = insertImport(source, modulePath, providerName, packageName);
      if (change instanceof InsertChange) {
        importChanges.push(change);
      }
    });
  });

  // Apply import changes
  let updatedContent = sourceText;
  importChanges.reverse().forEach(change => {
    updatedContent = updatedContent.slice(0, change.pos) + change.toAdd + updatedContent.slice(change.pos);
  });

  // Add providers to the providers array in @NgModule decorator
  if (updatedContent.includes('providers: [')) {
    const providersStart = updatedContent.indexOf('providers: [');
    const bracketStart = providersStart + 'providers: ['.length;

    // Find the matching closing bracket
    let bracketCount = 1;
    let bracketEnd = bracketStart;
    for (let i = bracketStart; i < updatedContent.length && bracketCount > 0; i++) {
      if (updatedContent[i] === '[') {
        bracketCount++;
      }
      if (updatedContent[i] === ']') {
        bracketCount--;
      }
      if (bracketCount === 0) {
        bracketEnd = i;
        break;
      }
    }

    const existingProviders = updatedContent.substring(bracketStart, bracketEnd).trim();
    let newProviders;
    if (existingProviders) {
      const cleanExisting = existingProviders.replace(/,\s*$/, '');
      newProviders = `${cleanExisting},\n    ${providers.join(',\n    ')}`;
    } else {
      newProviders = `\n    ${providers.join(',\n    ')}\n  `;
    }

    updatedContent = updatedContent.substring(0, bracketStart) + newProviders + updatedContent.substring(bracketEnd);
  } else {
    // Add providers array if it doesn't exist in @NgModule
    const ngModuleRegex = /(@NgModule\s*\(\s*{[^}]*)(}\s*\))/s;
    const match = updatedContent.match(ngModuleRegex);
    if (match) {
      const providersArray = `providers: [\n    ${providers.join(',\n    ')}\n  ],\n  `;
      updatedContent = updatedContent.replace(ngModuleRegex, `$1${providersArray}$2`);
    }
  }

  tree.overwrite(modulePath, updatedContent);
  return tree;
}

export function addProvidersToStandaloneApp(tree: Tree, project: any, providers: string[]): Tree {
  const appConfigPath = `${project.sourceRoot}/app/app.config.ts`;
  const mainPath = `${project.sourceRoot}/main.ts`;

  let configPath = '';

  // Determine which file to modify
  if (tree.exists(appConfigPath)) {
    configPath = appConfigPath;
  } else if (tree.exists(mainPath)) {
    configPath = mainPath;
  } else {
    throw new Error('No app.config.ts or main.ts found for standalone app');
  }

  const configSource = tree.read(configPath);
  if (!configSource) {
    throw new Error(`Config file ${configPath} not found`);
  }

  const sourceText = configSource.toString();
  const source = ts.createSourceFile(configPath, sourceText, ts.ScriptTarget.Latest, true);

  // Add import statements
  const importChanges: InsertChange[] = [];
  providers.forEach(provider => {
    const providerNames = extractProviderNames(provider);
    providerNames.forEach(providerName => {
      const packageName = getPackageForProvider(providerName);
      const change = insertImport(source, configPath, providerName, packageName);
      if (change instanceof InsertChange) {
        importChanges.push(change);
      }
    });

    // Add DynamicSwitchDriverService import when using provideDaffProductDriver
    if (provider.includes('provideDaffProductDriver')) {
      const driverChange = insertImport(source, configPath, 'DynamicSwitchDriverService', './daff/product/drivers/demo/dynamic/dynamic-switch.service');
      if (driverChange instanceof InsertChange) {
        importChanges.push(driverChange);
      }
    }

    // Add DEMO_MAGENTO_ENDPOINT_SWITCH import when using provideMagentoDriver
    if (provider.includes('DEMO_MAGENTO_ENDPOINT_SWITCH')) {
      const endpointChange = insertImport(source, configPath, 'DEMO_MAGENTO_ENDPOINT_SWITCH', './daff/product/drivers/demo/magento/endpoint-switch.token');
      if (endpointChange instanceof InsertChange) {
        importChanges.push(endpointChange);
      }
    }

    // Add importProvidersFrom import for modules used as providers
    if (provider.includes('Module')) {
      const importProvidersChange = insertImport(source, configPath, 'importProvidersFrom', '@angular/core');
      if (importProvidersChange instanceof InsertChange) {
        importChanges.push(importProvidersChange);
      }
    }
  });

  // Apply import changes
  let updatedContent = sourceText;
  importChanges.reverse().forEach(change => {
    updatedContent = updatedContent.slice(0, change.pos) + change.toAdd + updatedContent.slice(change.pos);
  });

  // Add providers to the providers array
  const providersToAdd = providers.map(provider => {
    if (provider.includes('Module')) {
      return `importProvidersFrom(${provider})`;
    }
    return provider;
  });

  // Find and update the providers array
  if (updatedContent.includes('providers: [')) {
    // Add to existing providers array - find the last item before closing bracket
    const providersStart = updatedContent.indexOf('providers: [');
    const bracketStart = providersStart + 'providers: ['.length;

    // Find the matching closing bracket
    let bracketCount = 1;
    let bracketEnd = bracketStart;
    for (let i = bracketStart; i < updatedContent.length && bracketCount > 0; i++) {
      if (updatedContent[i] === '[') {
        bracketCount++;
      }
      if (updatedContent[i] === ']') {
        bracketCount--;
      }
      if (bracketCount === 0) {
        bracketEnd = i;
        break;
      }
    }

    const existingProviders = updatedContent.substring(bracketStart, bracketEnd).trim();
    let newProviders;
    if (existingProviders) {
      // Clean up any malformed syntax and add new providers
      const cleanExisting = existingProviders.replace(/,\s*$/, '').replace(/\]\s*$/, '');
      newProviders = `${cleanExisting},\n    ${providersToAdd.join(',\n    ')}`;
    } else {
      newProviders = `\n    ${providersToAdd.join(',\n    ')}\n  `;
    }

    updatedContent = updatedContent.substring(0, bracketStart) + newProviders + updatedContent.substring(bracketEnd);
  } else {
    // Add providers array if it doesn't exist
    const configRegex = /(export const appConfig[^=]*=\s*{[^}]*)(})/s;
    const match = updatedContent.match(configRegex);
    if (match) {
      const providersArray = `providers: [\n    ${providersToAdd.join(',\n    ')}\n  ],\n  `;
      updatedContent = updatedContent.replace(configRegex, `$1${providersArray}$2`);
    }
  }

  tree.overwrite(configPath, updatedContent);
  return tree;
}

function getPackageForImport(importName: string): string {
  const packageMap: { [key: string]: string } = {
    DaffCoreModule: '@daffodil/core',
    DaffMagentoModule: '@daffodil/driver/magento',
    DaffInMemoryModule: '@daffodil/driver/in-memory',
    DaffButtonModule: '@daffodil/design/button',
    DaffCardModule: '@daffodil/design/card',
    DaffContainerModule: '@daffodil/design/container',
    DaffNavbarModule: '@daffodil/design/navbar',
    DaffSidebarModule: '@daffodil/design/sidebar',
    DaffCartStateModule: '@daffodil/cart/state',
    DaffCartMagentoDriverModule: '@daffodil/cart/driver/magento',
    DaffCartInMemoryDriverModule: '@daffodil/cart/driver/in-memory',
    DaffProductStateModule: '@daffodil/product/state',
    DaffProductMagentoDriverModule: '@daffodil/product/driver/magento',
    DaffProductInMemoryDriverModule: '@daffodil/product/driver/in-memory',
    DaffAuthStateModule: '@daffodil/auth/state',
    DaffAuthMagentoDriverModule: '@daffodil/auth/driver/magento',
    DaffAuthInMemoryDriverModule: '@daffodil/auth/driver/in-memory',
    DaffSearchStateModule: '@daffodil/search/state',
    DaffSearchProductMagentoDriverModule: '@daffodil/search-product/driver/magento',
    DaffSearchProductInMemoryDriverModule: '@daffodil/search-product/driver/in-memory',
    DaffCheckoutStateModule: '@daffodil/checkout/state',
  };

  return packageMap[importName] || '@daffodil/core';
}

function getPackageForProvider(providerName: string): string {
  // For modules used as providers, use the same mapping
  if (providerName.includes('Module')) {
    return getPackageForImport(providerName);
  }

  // Add mappings for standalone providers if needed
  const providerMap: { [key: string]: string } = {
    importProvidersFrom: '@angular/core',
    provideStore: '@ngrx/store',
    provideEffects: '@ngrx/effects',
    provideStoreDevtools: '@ngrx/store-devtools',
    provideRouter: '@angular/router',
    provideHttpClient: '@angular/common/http',
    provideDaffInMemoryBackends: '@daffodil/driver/in-memory',
    provideDaffInMemoryDriverConfig: '@daffodil/driver/in-memory',
    provideDaffInMemoryDriver: '@daffodil/driver/in-memory',
    provideDaffProductDriver: '@daffodil/product/driver',
    provideDaffProductInMemoryDriver: '@daffodil/product/driver/in-memory',
    provideDaffDevTools: '@daffodil/dev-tools',
    withDriverConfig: '@daffodil/dev-tools',
    provideMagentoDriver: '@daffodil/driver/magento',
    provideDaffProductMagentoDriver: '@daffodil/product/driver/magento',
  };

  return providerMap[providerName] || '@angular/core';
}

function extractProviderNames(provider: string): string[] {
  // Extract only provider function names (functions starting with 'provide' or 'with')
  // Handles cases like "provideDaffDevTools({}, withDriverConfig({...}))"
  // Avoids matching constructor calls like "new Map()" within configuration objects
  const functionRegex = /\b((?:provide|with)[a-zA-Z0-9_]*)\s*\(/g;
  const matches: string[] = [];
  let match;

  while ((match = functionRegex.exec(provider)) !== null) {
    matches.push(match[1]);
  }

  return matches.length > 0 ? matches : [provider];
}
