import * as assert from 'node:assert/strict';
import { describe, it } from 'mocha';

import { compose } from '@produck/compose';

describe('::example::recursion', function () {
	it('should run in order.', function () {
		const list = [];

		const workflow = compose(
			function _0({ depth }, next) {
				list.push(`${depth}0F`);
				next();
				list.push(`${depth}0P`);
			},
			function _1({ depth }, next) {
				list.push(`${depth}1F`);
				next();
				list.push(`${depth}1P`);
			},
			function end(ctx, next) {
				if (ctx.depth > 0) {
					return;
				}

				ctx.depth++;
				workflow(ctx, next);
			},
		);

		workflow({ depth: 0 });

		assert.deepEqual(list, [
			...['00F', '01F', '10F', '11F'],
			...['00P', '01P', '10P', '11P'].reverse(),
		]);
	});
});
