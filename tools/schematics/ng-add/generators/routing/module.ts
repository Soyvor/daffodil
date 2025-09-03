import {
  Rule,
  SchematicContext,
  Tree,
} from '@angular-devkit/schematics';

/**
 * Updates or creates module-based app routing configuration (app-routing.module.ts).
 *
 * @param routingModulePath - Path to the app-routing.module.ts file
 * @returns A Rule that updates the routing configuration
 */
export function updateModuleRouting(routingModulePath: string): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const routingSource = tree.read(routingModulePath);

    if (!routingSource) {
      // Create routing module if it doesn't exist
      const routingContent = `import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', loadComponent: () => import('./daff/product/components/product-list/product-list.component').then(m => m.ProductListComponent) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }`;

      tree.create(routingModulePath, routingContent);
    } else {
      // File exists, append routes
      const sourceText = routingSource.toString();
      const routesToAdd = `  { path: '', loadComponent: () => import('./daff/product/components/product-list/product-list.component').then(m => m.ProductListComponent) },`;

      // Find the routes array and add new routes
      const routesPattern = /(const routes:\s*Routes\s*=\s*\[)([\s\S]*?)(\];)/;

      if (routesPattern.test(sourceText)) {
        const updatedContent = sourceText.replace(routesPattern, (_, start, existing, end) => {
          const existingRoutes = existing.trim();
          const newRoutes = existingRoutes
            ? `${existing.trimEnd()},\n${routesToAdd}\n`
            : `\n${routesToAdd}\n`;
          return `${start}${newRoutes}${end}`;
        });

        tree.overwrite(routingModulePath, updatedContent);
      }
    }

    return tree;
  };
}
