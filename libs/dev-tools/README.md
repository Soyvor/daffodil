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
				currentDriver: 'in-memory',
				availableDrivers: [
					{
						id: 'in-memory',
						name: 'In-Memory Driver',
						properties: new Map([
							['apiKey', { type: 'input', id: 'apiKey', label: 'API Key', defaultValue: '' }],
							['timeout', { type: 'input', id: 'timeout', label: 'Timeout (ms)', defaultValue: '5000' }],
						]),
					},
					{
						id: 'shopify',
						name: 'Shopify Driver',
						properties: new Map([
							['shopUrl', { type: 'input', id: 'shopUrl', label: 'Shop URL', defaultValue: 'myshop.myshopify.com' }],
							['accessToken', { type: 'input', id: 'accessToken', label: 'Access Token', defaultValue: '' }],
						]),
					},
					{
						id: 'magento',
						name: 'Magento Driver',
						properties: new Map([
							['baseUrl', { type: 'input', id: 'baseUrl', label: 'Base URL', defaultValue: 'https://my-magento-store.com' }],
							['storeCode', { type: 'input', id: 'storeCode', label: 'Store Code', defaultValue: 'default' }],
						]),
					},
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
				availableDrivers: [
					{
						id: 'in-memory',
						name: 'In-Memory Driver',
						properties: new Map(),
					},
					{
						id: 'magento',
						name: 'Magento Driver',
						properties: new Map([
							['baseUrl', { type: 'input', id: 'baseUrl', label: 'Base URL', defaultValue: 'https://my-magento-store.com' }],
						]),
					},
				],
			}),
			withDriverConfig({
				name: '@daffodil/cart/driver',
				status: 'disconnected',
				currentDriver: 'magento',
				availableDrivers: [
					{
						id: 'in-memory',
						name: 'In-Memory Driver',
						properties: new Map(),
					},
					{
						id: 'magento',
						name: 'Magento Driver',
						properties: new Map([
							['storeCode', { type: 'input', id: 'storeCode', label: 'Store Code', defaultValue: 'default' }],
						]),
					},
				],
			}),
		),
	],
});
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
