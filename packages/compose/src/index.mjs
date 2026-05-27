import * as Ow from '@produck/ow';
import { ThrowTypeError } from '@produck/type-error';

function assertHandlerAt(value, index) {
  if (typeof value !== 'function') {
    ThrowTypeError(`handlers[${index}]`, 'function');
  }
}

const DEFAULT_DONE = () => {};

export function compose(...handlers) {
  handlers.forEach(assertHandlerAt);

  const { length } = handlers;

  return function workflow(context, done = DEFAULT_DONE) {
    if (typeof done !== 'function') {
      ThrowTypeError('done', 'function');
    }

    return (function link(index, context) {
      if (index === length) {
        return done();
      }

      let called = false;

      return handlers[index](context, function next(nextContext = context) {
        if (called) {
          return Ow.Error.Common('A next() called multiple times.');
        }

        called = true;

        return link(index + 1, nextContext);
      });
    })(0, context);
  };
}
