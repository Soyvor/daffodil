import { defineConfig } from 'eslint/config';
import daffDocsPlugin from 'eslint-plugin-daff-docs';
import rootConfig from '../../eslint.config.mjs';
export default defineConfig([
	...rootConfig,
	{
		files: ['**/*.ts'],
		rules: {
			'no-case-declarations': 'warn',
			'no-useless-escape': 'warn',
			'no-unsafe-optional-chaining': 'warn'
		}
	}
]);
