import * as assert from 'node:assert/strict';
import { describe, it } from 'mocha';

import { compose } from '@produck/compose';

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

describe('compose()', function () {
	it('should build a composed handler.', function () {
		compose();
		compose(() => {});
	});

	it('should throw if bad handler.', function () {
		assert.throws(() => compose(null), {
			name: 'TypeError',
			message: 'Invalid "handlers[0]", one "function" expected.',
		});
	});

	describe('=>composedHandler()', function () {
		it('should throw if bad next', function () {
			assert.throws(() => compose()(null, null), {
				name: 'TypeError',
				message: 'Invalid "next", one "function" expected.',
			});
		});

		it('should work for normal function with default next().', function () {
			const flagList = [];

			compose(
				(_, next) => {
					flagList.push(0);
					next();
				},
				(_, next) => {
					flagList.push(1);
					next();
				},
			)();

			assert.deepEqual(flagList, [0, 1]);
		});

		it('should work for normal function with specific next().', function () {
			const flagList = [];

			compose(
				(_, next) => {
					flagList.push(0);
					next();
				},
				(_, next) => {
					flagList.push(1);
					next();
				},
			)(null, () => flagList.push(2));

			assert.deepEqual(flagList, [0, 1, 2]);
		});

		it('should work for async function.', async function () {
			const flagList = [];

			await compose(async (_, next) => {
				await sleep(2000);
				flagList.push(0);
				await next();
			}, async (_, next) => {
				await sleep(1000);
				flagList.push(1);
				await next();
			},
			)();

			assert.deepEqual(flagList, [0, 1]);
		});

		it('should throw if multiple next().', function () {
			assert.throws(() => {
				compose((_, next) => next(next()), () => {})(null);
			}, {
				name: 'Error',
				message: 'A next() called multiple times.',
			});
		});

		it('should catch if next() throw.', async function () {
			let flag = false;

			await compose(async function intercept(_, next) {
				try {
					await next();
				} catch (error) {
					flag = true;
					assert.equal(error.message, 'foo');
				}
			}, function () {
				throw new Error('foo');
			})();

			assert.equal(flag, true);
		});

		it.only('should be forked to call handler by conditions.', function () {
			function handlerC(_, next) {
				next();

				return 'c';
			}

			const workflowA = compose(function A(_, next) {
				const ret = next(handlerC);

				assert.equal(ret, 'c');

				return 'a';
			});

			const workflowB = compose(function B(_, next) {
				const ret = next(handlerC);

				assert.equal(ret, 'c');

				return 'b';
			});

			const workflowMain = compose(
				function PreMain(_, next) {
					if (flag) {
						return next(workflowA);
					} else {
						return next(workflowB);
					}
				},
				function PostMain(_, next) {
					next();

					return 'end';
				},
			);

			let flag = true;

			assert.equal(workflowMain(), 'a');
			flag = false;
			assert.equal(workflowMain(), 'b');
		});
	});
});
