function reactive<T>(reaction: () => T): T
function reactive<T>(constructor: any, a2, a3?): void
function reactive<T>(...args: unknown[]): unknown {
    if (typeof args[0] === 'function') {
        return args[0] as unknown as T
    }
}

export default reactive
