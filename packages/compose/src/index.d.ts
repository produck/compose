type Next = () => any;
export type Handler<T = any, R = any> = (context: T, next: Next) => R;
export function compose(): () => undefined;

export function compose<
	T,
	B extends Handler
>(
	bottom: B,
	...handlers: Handler[],
): Handler<T, ReturnType<B>>;

export function compose<
	T, B extends Handler<T>
>(
	bottom: B,
	...handler: Handler<T>[],
): ReturnType<B>;
