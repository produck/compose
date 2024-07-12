function assertHandlerAt(value, index) {
	if (typeof value !== 'function') {
		throw new TypeError(`Invalid "handlers[${index}]", one "function" expected.`);
	}
}

function assertNext(value) {
	if (typeof value !== 'function') {
		throw new TypeError('Invalid "next", one "function" expected.');
	}
}

const NO_NEXT = () => {};

export function compose(...handlers) {
	handlers.forEach(assertHandlerAt);

	const length = handlers.length;

	return function workflow(context, next = NO_NEXT) {
		assertNext(next);

		let current = -1;

		return (function linker(index) {
			if (index <= current) {
				throw new Error('A next() called multiple times.');
			}

			current = index;

			if (index === length) {
				return next();
			}

			return handlers[index](context, linker.bind(undefined, index + 1));
		})(0);
	};
}
