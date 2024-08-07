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

		return (function linker(index) {
			if (index === length) {
				return next();
			}

			let jumped = false;

			return handlers[index](context, function jump(...args) {
				if (jumped) {
					throw new Error('A next() called multiple times.');
				}

				const [handler] = args;

				if (typeof handler === 'function') {
					return handler(context, jump);
				}

				jumped = true;

				if (args.length === 0) {
					return linker(index + 1);
				}

				const [offset] = args;

				if (Number.isInteger(offset)) {
					return linker(index + offset);
				}

				throw new Error('Bad jumping locator.');
			});
		})(0);
	};
}
