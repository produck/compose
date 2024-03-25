const assertArrayOfFunction = (value, index) => {
	if (typeof value !== 'function') {
		throw new TypeError(`Invalid "handlers[${index}]", one "function" expected.`);
	}
};

export const compose = (...handlers) => {
	handlers.forEach(assertArrayOfFunction);

	return (context, next = () => {}, current = -1) => {
		if (typeof next !== 'function') {
			throw new TypeError('Invalid "next", one "function" expected.');
		}

		return (function _next(index) {
			if (index <= current) {
				throw new Error('A next() called multiple times.');
			}

			current = index;

			if (index === handlers.length) {
				return next();
			}

			return handlers[index](context, _next.bind(undefined, index + 1));
		})(0);
	};
};
