import globalify from '../globalify'

if (typeof window === 'undefined') {
    const { AsyncDisposableStack, DisposableStack, SuppressedError, patchSymbols } = await import(
        '@whatwg-node/disposablestack'
    )

    globalify({
        AsyncDisposableStack,
        DisposableStack,
        SuppressedError,
    })

    patchSymbols()
}

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
        disposable: originalDisposableUse.call(
            this,
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
