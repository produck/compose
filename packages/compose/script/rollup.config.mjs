import { nodeResolve } from '@rollup/plugin-node-resolve';

import { createRequire } from 'node:module';
import path from 'node:path';

import { defineConfig } from 'rollup';
import terser from '@rollup/plugin-terser';

const require = createRequire(import.meta.url);
const meta = require('../package.json');

const BANNER =
	'/*!\n' +
	` * ${meta.name} v${meta.version}\n` +
	` * (c) 2023-${new Date().getFullYear()} ChaosLee\n` +
	` * Released under the ${meta.license} License.\n` +
	' */';

const moduleList = [
	{
		output: path.resolve('src/index.gen.cjs'),
		format: 'cjs',
		isExternal: true,
	},
];

export default moduleList.map(config => {
	const plugins = [
		nodeResolve({ preferBuiltins: true }),
		terser(),
	];

	return defineConfig({
		input: path.resolve('src/index.mjs'),
		treeshake: 'smallest',
		output: {
			file: config.output,
			format: config.format,
			name: config.name,
			banner: BANNER,
		},
		plugins,
	});
});
