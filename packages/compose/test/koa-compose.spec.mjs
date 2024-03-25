import * as assert from 'node:assert/strict';
import { describe, it } from 'mocha';

import { compose } from '../src/index.mjs';

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

describe('@koa-compose', function () {
	// https://github.com/koajs/compose/blob/master/test/test.js#L17
	it('should work', async () => {
		const arr = [];
		const stack = [];

		stack.push(async (_, next) => {
			arr.push(1);
			await wait(1);
			await next();
			await wait(1);
			arr.push(6);
		});

		stack.push(async (_, next) => {
			arr.push(2);
			await wait(1);
			await next();
			await wait(1);
			arr.push(5);
		});

		stack.push(async (_, next) => {
			arr.push(3);
			await wait(1);
			await next();
			await wait(1);
			arr.push(4);
		});

		await compose(...stack)({});
		assert.deepEqual(arr, [1, 2, 3, 4, 5, 6]);
	});

	// https://github.com/koajs/compose/blob/master/test/test.js#L49
	it('should be able to be called twice', () => {
		const stack = [];

		stack.push(async (context, next) => {
			context.arr.push(1);
			await wait(1);
			await next();
			await wait(1);
			context.arr.push(6);
		});

		stack.push(async (context, next) => {
			context.arr.push(2);
			await wait(1);
			await next();
			await wait(1);
			context.arr.push(5);
		});

		stack.push(async (context, next) => {
			context.arr.push(3);
			await wait(1);
			await next();
			await wait(1);
			context.arr.push(4);
		});

		const fn = compose(...stack);
		const ctx1 = { arr: [] };
		const ctx2 = { arr: [] };
		const out = [1, 2, 3, 4, 5, 6];

		return fn(ctx1).then(() => {
			assert.deepEqual(out, ctx1.arr);
			return fn(ctx2);
		}).then(() => {
			assert.deepEqual(out, ctx2.arr);
		});
	});

	// https://github.com/koajs/compose/blob/master/test/test.js#L93
	it('should create next functions that return a Promise', function () {
		const stack = [];
		const arr = [];

		for (let i = 0; i < 5; i++) {
			stack.push(async (_, next) => {
				arr.push(next());
			});
		}

		compose(...stack)({}, async () => {});

		for (const next of arr) {
			assert.ok(next instanceof Promise);
		}
	});

	// https://github.com/koajs/compose/blob/master/test/test.js#L109
	it('should work with 0 middleware', function () {
		compose()({});
	});

	// https://github.com/koajs/compose/blob/master/test/test.js#L113
	it('should only accept middleware as functions', () => {
		assert.throws(() => compose(null), {
			name: 'TypeError',
			message: 'Invalid "handlers[0]", one "function" expected.',
		});
	});

	// https://github.com/koajs/compose/blob/master/test/test.js#L117
	it('should work when yielding at the end of the stack', async () => {
		const stack = [];
		let called = false;

		stack.push(async (_, next) => {
			await next();
			called = true;
		});

		await compose(...stack)({});
		assert.ok(called);
	});

	// https://github.com/koajs/compose/blob/master/test/test.js#L130
	it('should reject on errors in middleware', async () => {
		const stack = [];

		stack.push(async () => { throw new Error(); });

		await assert.rejects(() => compose(...stack)({}), {
			name: 'Error',
		});
	});

	// https://github.com/koajs/compose/blob/master/test/test.js#L143
	it('should keep the context', () => {
		const ctx = {};

		const stack = [];

		stack.push(async (ctx2, next) => {
			await next();
			assert.equal(ctx2, ctx);
		});

		stack.push(async (ctx2, next) => {
			await next();
			assert.equal(ctx2, ctx);
		});

		stack.push(async (ctx2, next) => {
			await next();
			assert.equal(ctx2, ctx);
		});

		return compose(...stack)(ctx);
	});

	// https://github.com/koajs/compose/blob/master/test/test.js#L166
	it('should catch downstream errors', async () => {
		const arr = [];
		const stack = [];

		stack.push(async (ctx, next) => {
			arr.push(1);
			try {
				arr.push(6);
				await next();
				arr.push(7);
			} catch (err) {
				arr.push(2);
			}
			arr.push(3);
		});

		stack.push(async () => {
			arr.push(4);
			throw new Error();
		});

		await compose(...stack)({});
		assert.deepEqual(arr, [1, 6, 4, 2, 3]);
	});

	// https://github.com/koajs/compose/blob/master/test/test.js#L191
	it('should compose w/ next', () => {
		let called = false;

		return compose()({}, async () => {
			called = true;
		}).then(function () {
			assert.ok(called);
		});
	});

	// https://github.com/koajs/compose/blob/master/test/test.js#L201
	it('should handle errors in wrapped non-async functions', () => {
		const stack = [];

		stack.push(function () {
			throw new Error();
		});

		assert.throws(() => compose(...stack)(), { name: 'Error' });
	});

	// https://github.com/koajs/compose/blob/master/test/test.js#L216
	it('should compose w/ other compositions', async () => {
		const called = [];

		await compose(
			compose(
				(_, next) => next(called.push(1)),
				(_, next) => next(called.push(2)),
			),
			(_, next) => next(called.push(3)),
		)({});

		assert.deepEqual(called, [1, 2, 3]);
	});

	// https://github.com/koajs/compose/blob/master/test/test.js#L237
	it('should throw if next() is called multiple times', async () => {
		await assert.rejects(async () => await compose(async (_, next) => {
			await next();
			await next();
		})({}), {
			name: 'Error',
			message: /multiple times/,
		});
	});

	// https://github.com/koajs/compose/blob/master/test/test.js#L250
	it('should return a valid middleware', () => {
		let val = 0;

		compose(
			compose(
				(_, next) => {
					val++;
					return next();
				},
				(_, next) => {
					val++;
					return next();
				},
			),
			(_, next) => {
				val++;
				return next();
			},
		)({});

		assert.equal(val, 3);
	});

	// https://github.com/koajs/compose/blob/master/test/test.js#L272
	it('should return last return value', async () => {
		const stack = [];

		stack.push(async (_, next) => {
			assert.equal(await next(), 2);

			return 1;
		});

		stack.push(async (_, next) => {
			assert.equal(await next(), 0);

			return 2;
		});

		assert.equal(await compose(...stack)({}, () => 0), 1);
	});

	// https://github.com/koajs/compose/blob/master/test/test.js#L293
	it('should not affect the original middleware array');

	// https://github.com/koajs/compose/blob/master/test/test.js#L311
	it('should not get stuck on the passed in next', async () => {
		const ctx = {
			middleware: 0,
			next: 0,
		};

		await compose(async (ctx, next) => {
			ctx.middleware++;

			return next();
		})(ctx, () => ctx.next++).then(() => {
			assert.deepEqual(ctx, { middleware: 1, next: 1 });
		});
	});
});
