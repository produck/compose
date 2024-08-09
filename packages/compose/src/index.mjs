function assertHandlerAt(value, index) {
	if (typeof value !== 'function') {
		throw new TypeError(`Invalid "handlers[${index}]", one "function" expected.`);
	}
}

function assertDone(value) {
	if (typeof value !== 'function') {
		throw new TypeError('Invalid "done", one "function" expected.');
	}
}

const DEFAULT_DONE = () => {};

export function compose(...handlers) {
	handlers.forEach(assertHandlerAt);

	const { length } = handlers;

	return function workflow(context, done = DEFAULT_DONE) {
		assertDone(done);

		return (function link(index) {
			if (index === length) {
				return done();
			}

			let called = false;

			return handlers[index](context, function next() {
				if (called) {
					throw new Error('A next() called multiple times.');
				}

				called = true;

				return link(index + 1);
			});
		})(0);
	};
}
