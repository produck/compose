import * as assert from 'node:assert/strict';
import { describe, it } from 'mocha';

import { compose } from '@produck/compose';

describe('::example::branch', function () {
	it('should be forked to call handler by conditions.', function () {
		const workflowA = compose(function () {
			return 'a';
		});

		const workflowB = compose(function () {
			return 'b';
		});

		const workflowMain = compose(function (_, next) {
			if (flag) {
				return workflowA(_, next);
			} else {
				return workflowB(_, next);
			}
		});

		let flag = true;

		assert.equal(workflowMain(), 'a');
		flag = false;
		assert.equal(workflowMain(), 'b');
	});
});
