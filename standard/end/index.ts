export {}

declare global {
    function until<T, A extends unknown[]>(
        callback: (end: (value: T | PromiseLike<T>) => void, ...args: A) => T,
        ...args: A
    ): Promise<T>

    function use(effect: () => () => void): AtEnd
    function useAsync(effect: () => Promise<() => void>): Promise<AtEnd>
    type AtEnd = [() => void, Promise<void>]
    function atEnd(destructor: () => void): AtEnd
    interface Object {
        end: Promise<void>
    }

    function Timeout<A extends unknown[], R>(
        callback: (...args: A) => R,
        timeout?: number,
        ...args: A
    ): { dispose: () => void; end: Promise<void> }

    function Interval<A extends unknown[], R>(
        callback: (...args: A) => R,
        timeout?: number,
        ...args: A
    ): AtEnd
}

globalify({ use, useAsync, atEnd })

export async function until<T, A extends unknown[]>(
    callback: (end: (value: T | PromiseLike<T>) => void, ...args: A) => T,
    ...args: A
): Promise<T> {
    return new Promise(resolve => callback(resolve, ...args))
}

function use(effect: () => () => void): [() => void, Promise<void>] {
    return atEnd(effect())
}

async function useAsync(effect: () => Promise<() => void>): Promise<[() => void, Promise<void>]> {
    return atEnd(await effect())
}

function atEnd(destructor: () => void): [() => void, Promise<void>] {
    let end: () => void
    const promise = new Promise<void>(resolve => (end = resolve))

    return [
        async (): Promise<void> => {
            await destructor()
            end()
        },
        promise,
    ]
}

Object.defineProperty(Object.prototype, 'end', {
    enumerable: false,

    get() {
        Promise.reject('missing dispose/destroy')
    },
})

Object.defineProperty(Object.prototype, 'dispose', {
    set(value: () => void) {
        const [end, dispose] = atEnd(value)
        Object.defineProperty(this, 'end', { value: end })
        Object.defineProperty(this, 'dispose', { value: dispose })
    },
})

Object.defineProperty(Object.prototype, 'destroy', {
    set(value: () => void) {
        const [end, destroy] = atEnd(value)
        Object.defineProperty(this, 'end', { value: end })
        Object.defineProperty(this, 'destroy', { value: destroy })
    },
})

//
globalify({ timeout, interval })

function timeout<A extends unknown[], R>(
    callback: (...args: A) => R,
    timeout?: number,
    ...args: A
): { dispose: () => void; end: Promise<void> } {
    let identifier: NodeJS.Timeout
    let end: () => void

    const promise = new Promise<void>(resolve => {
        end = resolve
        identifier = setTimeout(() => {
            callback(...args)
            end()
        }, timeout)
    }) as Promise<void> & { dispose: () => void; end: Promise<void> }

    return {
        dispose: (): void => {
            clearTimeout(identifier)
            end()
        },
        end: promise,
    }
}

function interval<A extends unknown[], R>(
    callback: (...args: A) => R,
    timeout?: number,
    ...args: A
): AtEnd {
    const identifier = setInterval(callback, timeout, ...args)
    return atEnd(() => clearInterval(identifier))
}
