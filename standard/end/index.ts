export {}

declare global {
    function use(effect: () => () => void): AtEnd
    function useAsync(effect: () => Promise<() => void>): Promise<AtEnd>
    type AtEnd = [() => void, Promise<void>]
    function atEnd(destructor: () => void): AtEnd
    interface Object {
        end: Promise<void>
    }

    function timeout<A extends unknown[], R>(
        callback: (...args: A) => R,
        timeout?: number,
        ...args: A
    ): AtEnd

    function interval<A extends unknown[], R>(
        callback: (...args: A) => R,
        timeout?: number,
        ...args: A
    ): AtEnd
}

globalify({ use, useAsync, atEnd })

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
): Promise<void> & AtEnd {
    let identifier: NodeJS.Timeout
    let end: () => void

    const promise = new Promise<void>(resolve => {
        end = resolve
        identifier = setTimeout(() => {
            callback(...args)
            resolve()
        }, timeout)
    }) as Promise<void> & AtEnd

    Object.assign(
        promise,
        atEnd(() => {
            clearTimeout(identifier)
            end()
        })
    )

    return promise
}

function interval<A extends unknown[], R>(
    callback: (...args: A) => R,
    timeout?: number,
    ...args: A
): AtEnd {
    const identifier = setInterval(callback, timeout, ...args)
    return atEnd(() => clearInterval(identifier))
}
