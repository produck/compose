import { Assert, Error, NULL, I } from '@produck/idiom-common';

const assertArrayOfFunction = (value, index) => {
	return Assert.FunctionType(value, `handlers[${index}]`);
};

export const compose = (...handlers) => {
	I.Array.forEach(handlers, assertArrayOfFunction);

	return (context, next = () => {}, current = -1) => {
		Assert.FunctionType(next, 'next');

		return (function _next(index) {
			if (index <= current) {
				Error.Throw('A next() called multiple times.');
			}

			current = index;

			if (index === I.Array.length(handlers)) {
				return next();
			}

			return handlers[index](context, _next.bind(NULL, index + 1));
		})(0);
	};
};
