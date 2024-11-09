import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import ProduckLint from '@produck/eslint-rules';

export default [
	{languageOptions: { globals: {...globals.browser, ...globals.node} }},
	pluginJs.configs.recommended,
	...tseslint.configs.recommended,
	ProduckLint,
];
