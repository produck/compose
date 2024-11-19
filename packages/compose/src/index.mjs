import * as Ow from '@produck/ow';
import { Assert } from '@produck/idiom';

function assertHandlerAt(value, index) {
	Assert.Type.Function(value, `handlers[${index}]`);
}

const DEFAULT_DONE = () => {};

export function compose(...handlers) {
	handlers.forEach(assertHandlerAt);

	const { length } = handlers;

	return function workflow(context, done = DEFAULT_DONE) {
		Assert.Type.Function(done, 'done');

		return (function link(index) {
			if (index === length) {
				return done();
			}

			let called = false;

			return handlers[index](context, function next() {
				if (called) {
					return Ow.Error.Common('A next() called multiple times.');
				}

				called = true;

				return link(index + 1);
			});
		})(0);
	};
}
