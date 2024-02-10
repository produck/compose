const assertArrayOfFunction = (value, index) => {
	if (typeof value !== 'function') {
		throw new TypeError(`Invalid handlers[${index}], one "function" expected.`);
	}
};

const NULL_NEXT = () => {};

export function compose(...handlers) {
	handlers.forEach(assertArrayOfFunction);

	return function composed(context, next = NULL_NEXT) {
		if (typeof next !== 'function') {
			throw new TypeError('Invalid "next", one "function" expected.');
		}

		let current = -1;

		return (function _next(index) {
			if (index <= current) {
				throw new Error('A next() called multiple times.');
			}

			current = index;

			if (index === handlers.length) {
				return next();
			}

			return handlers[index](context, _next.bind(null, index + 1));
		})(0);
	};
}
