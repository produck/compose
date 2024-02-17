type Next = () => any;
export type Handler<T> = (context: T, next: Next) => Promise<any>;
export function compose<T>(...handler: Handler<T>[]): Handler<T>;
