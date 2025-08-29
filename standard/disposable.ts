export {}

declare global {
    interface DisposableStack {
        use<T, C extends (...args: A) => T & Disposable, A extends unknown[]>(
            funcReturnsDisposable: C,
            ...args: A
        ): { disposable: ReturnType<C> }
    }
    interface AsyncDisposableStack {
        use<T, C extends (...args: A) => T & AsyncDisposable, A extends unknown[]>(
            funcReturnsAsyncDisposable: C,
            ...args: A
        ): { disposable: ReturnType<C> }
    }
}

const originalDisposableUse = DisposableStack.prototype.use as <T extends Disposable>(
    disposable: T
) => T
DisposableStack.prototype.use = function use<
    T,
    C extends (...args: A) => T & Disposable,
    A extends unknown[],
>(funcReturnsDisposable: C, ...args: A): { disposable: ReturnType<C> } {
    return {
        // eslint-disable-next-line no-misused-disposable-plugin/no-misused-disposable
        disposable: originalDisposableUse.call(
            this,
            // eslint-disable-next-line no-misused-disposable-plugin/no-misused-disposable
            funcReturnsDisposable(...args)
        ) as ReturnType<C>,
    }
}

const originalAsyncDisposableUse = AsyncDisposableStack.prototype.use as <
    T extends AsyncDisposable,
>(
    disposable: T
) => T
AsyncDisposableStack.prototype.use = function use<
    T,
    C extends (...args: A) => T & AsyncDisposable,
    A extends unknown[],
>(funcReturnsAsyncDisposable: C, ...args: A): { disposable: ReturnType<C> } {
    return {
        disposable: originalAsyncDisposableUse.call(
            this,

            funcReturnsAsyncDisposable(...args)
        ) as ReturnType<C>,
    }
}
