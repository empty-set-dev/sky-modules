import globalify from 'sky/helpers/globalify'

declare global {
    /**
     * @param {object} target
     * @param {number | string | symbol} propertyKey
     * @param {TypedPropertyDescriptor} descriptor
     * @returns {TypedPropertyDescriptor<T> | void}
     */
    function bind<T extends Function>(
        target: object,
        propertyKey: string | symbol,
        descriptor: TypedPropertyDescriptor<T>
    ): TypedPropertyDescriptor<T> | void
}

function bind<T extends Function>(
    target: object,
    propertyKey: number | string | symbol,
    descriptor: TypedPropertyDescriptor<T>
): TypedPropertyDescriptor<T> | void {
    return {
        configurable: true,
        get(this: T): T {
            const value = descriptor.value.bind(this)
            Object.defineProperty(this, propertyKey, {
                value,
                configurable: true,
                writable: true,
            })
            return value
        },
    }
}

globalify({ bind })
