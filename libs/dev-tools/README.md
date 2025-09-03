# @daffodil/dev-tools

Developer tools for Daffodil e-commerce framework applications.

## Features

- **Debug Bar**: Visual interface for switching between different Daffodil drivers
- **Driver Management**: Easy switching between In-Memory, Shopify, Magento, and other drivers

## Installation

```bash
npm install @daffodil/dev-tools
```

## Usage

### Basic Setup

Configure dev tools in your application bootstrap:

```typescript
import { provideDaffDevTools, withDriverConfig } from '@daffodil/dev-tools';

bootstrapApplication(AppComponent, {
	providers: [
		provideDaffDevTools(
			{
				enabled: true,
				startCollapsed: true,
			},
			withDriverConfig({
				name: '@daffodil/product/driver',
				status: 'connected',
				currentDriver: 'In-Memory Driver',
				availableDrivers: [
					'In-Memory Driver',
					'Shopify Driver',
					'Magento Driver',
				],
			}),
		),
	],
});
```

### Multiple Driver Configuration

Configure multiple drivers at once using multiple `withDriverConfig` calls:

```typescript
import { provideDaffDevTools, withDriverConfig } from '@daffodil/dev-tools';

bootstrapApplication(AppComponent, {
	providers: [
		provideDaffDevTools(
			{ enabled: true },
			withDriverConfig({
				name: '@daffodil/product/driver',
				status: 'connected',
				currentDriver: 'in-memory',
				availableDrivers: ['in-memory', 'magento'],
				onDriverChange: newDriver =>
					console.log('Product driver changed to:', newDriver),
				onTestConnection: () =>
					console.log('Testing product driver connection'),
				metadata: { version: '1.0.0' },
			}),
			withDriverConfig({
				name: '@daffodil/cart/driver',
				status: 'disconnected',
				currentDriver: 'magento',
				availableDrivers: ['in-memory', 'magento'],
				onApplyChanges: () => console.log('Applying cart driver changes'),
			}),
		),
	],
});
```

### Runtime Registration

Add driver cards dynamically at runtime:

```typescript
import { DaffDevToolsConfigService } from '@daffodil/dev-tools';

constructor(private devToolsConfig: DaffDevToolsConfigService) {
  devToolsConfig.registerDriver({
    name: '@daffodil/cart/driver',
    status: 'connected',
    currentDriver: 'In-Memory Driver',
    availableDrivers: ['In-Memory Driver', 'Custom API'],
    onApplyChanges: () => this.applyCartDriverChange(),
    onDriverChange: (newDriver) => this.switchCartDriver(newDriver)
  });
}
```

### Add to Template

```typescript
import { DaffDebugBarComponent } from '@daffodil/dev-tools';

@Component({
	standalone: true,
	imports: [DaffDebugBarComponent],
	template: `
		<daff-debug-bar></daff-debug-bar>
	`,
})
export class AppComponent {}
```

### Development Mode Only

For production builds, conditionally include the debug bar:

```typescript
import { isDevMode } from '@angular/core';

@Component({
	template: `
		@if (isDevMode) {
		<daff-debug-bar></daff-debug-bar>
		}
	`,
})
export class AppComponent {
	isDevMode = isDevMode();
}
```
