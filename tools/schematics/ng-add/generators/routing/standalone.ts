import {
  Rule,
  SchematicContext,
  Tree,
} from '@angular-devkit/schematics';

/**
 * Updates or creates standalone app routing configuration (app.routes.ts).
 *
 * @param routingFilePath - Path to the app.routes.ts file
 * @returns A Rule that updates the routing configuration
 */
export function updateStandaloneRouting(routingFilePath: string): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const routingSource = tree.read(routingFilePath);

    if (!routingSource) {
      // Create standalone routes file
      const routingContent = `import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./daff/product/components/product-list/product-list.component').then(m => m.ProductListComponent) },
];`;

      tree.create(routingFilePath, routingContent);
    } else {
      // File exists, append routes
      const sourceText = routingSource.toString();
      const routesToAdd = `  { path: '', loadComponent: () => import('./daff/product/components/product-list/product-list.component').then(m => m.ProductListComponent) },`;

      // Find the routes array and add new routes
      const exportRoutesPattern = /(export const routes:\s*Routes\s*=\s*\[)([\s\S]*?)(\];)/;

      if (exportRoutesPattern.test(sourceText)) {
        const updatedContent = sourceText.replace(exportRoutesPattern, (_, start, existing, end) => {
          const existingRoutes = existing.trim();
          const newRoutes = existingRoutes
            ? `${existing.trimEnd()},\n${routesToAdd}\n`
            : `\n${routesToAdd}\n`;
          return `${start}${newRoutes}${end}`;
        });

        tree.overwrite(routingFilePath, updatedContent);
      }
    }

    return tree;
  };
}
