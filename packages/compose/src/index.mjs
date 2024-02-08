const assertArrayOfFunction = (value, index) => {
	if (typeof value !== 'function') {
		throw new TypeError(`Invalid handlers[${index}], one "function" expected.`);
	}
};

export function compose(...handlers) {
	handlers.forEach(assertArrayOfFunction);

	return function composedHandler(context, next) {
		let last = -1;

		return (function Next(index) {
			if (index <= last) {
				throw new Error('next() called multiple times.');
			}

			last = index;

			if (index > handlers.length) {
				return;
			}

			const handler = index === handlers.length ? next : handlers[index];

			return handler(context, Next.bind(undefined, index + 1));
		})(0);
	};
}
