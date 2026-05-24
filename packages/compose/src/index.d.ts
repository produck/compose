/** A function that continues the middleware chain. */
type Next = () => unknown;

/**
 * A middleware handler that receives a context and a `next` callback.
 * @typeParam T - The shape of the context object.
 * @typeParam R - The return type of the handler.
 */
export type Handler<T = unknown, R = unknown> = (context: T, next: Next) => R;

/**
 * Composes zero or more handlers into a single middleware function.
 * When called with no arguments, returns a no-op handler.
 */
export function compose(): () => undefined;

/**
 * Composes one or more handlers into a single middleware function.
 * The returned handler's return type is inferred from the **bottom** handler.
 * @typeParam T - The context type for the composed handler.
 * @typeParam B - The bottom (first) handler type.
 * @param bottom - The first handler in the chain.
 * @param handlers - Additional handlers to compose.
 */
export function compose<T, B extends Handler>(
  bottom: B,
  ...handlers: Handler[]
): Handler<T, ReturnType<B>>;

/**
 * Composes one or more handlers that share the same context type.
 * The return type is inferred from the **bottom** handler.
 * @typeParam T - The context type shared by all handlers.
 * @typeParam B - The bottom (first) handler type.
 * @param bottom - The first handler in the chain.
 * @param handler - Additional handlers sharing the same context type.
 */
export function compose<T, B extends Handler<T>>(
  bottom: B,
  ...handler: Handler<T>[]
): ReturnType<B>;
