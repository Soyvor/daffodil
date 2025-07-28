import { defineConfig, globalIgnores } from 'eslint/config';
import rootConfig from '../../eslint.config.mjs';
export default defineConfig([
	globalIgnores([
		'libs/driver/shopify/src/codegen/generated-shopify-types.ts'
	]),
	...rootConfig,
]);
