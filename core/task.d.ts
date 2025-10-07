declare global {
    function task<T, A extends unknown[]>(callback: (...args: A) => Promise<T> | void, ...args: A): PromiseLike<T>;
    function task<T, A extends unknown[], R>(object: T, callback: (this: T, ...args: A) => Promise<R> | void, ...args: A): PromiseLike<R>;
    type Async<R = void> = Promise<R>;
    function continuous<T, A extends unknown[], R>(object: T, callback: (...args: A) => Promise<R>, ...args: A): Promise<T>;
    function continuous<A extends unknown[], T>(callback: (...args: A) => Promise<T>, ...args: A): Promise<T>;
    const default_onAsyncError: typeof lib.default_onAsyncError;
    let onAsyncError: (error: unknown) => void;
}
declare namespace lib {
    function task<T, A extends unknown[], R>(...args: unknown[]): Promise<void | R>;
    function continuous<T, A extends unknown[], R>(...args: unknown[]): Promise<R>;
    function default_onAsyncError(error: unknown): void;
}
export {};
//# sourceMappingURL=task.d.ts.map