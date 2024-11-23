import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import * as ProduckEslint from '@produck/eslint-rules';

export default [
	{languageOptions: { globals: {...globals.browser, ...globals.node} }},
	pluginJs.configs.recommended,
	...tseslint.configs.recommended,
	ProduckEslint.config,
];
