import globalify from 'sky/helpers/globalify'

declare global {
    function bind<T extends Function>(
        target: object,
        propertyKey: string | symbol,
        descriptor?: TypedPropertyDescriptor<T>
    ): void
}

function bind<T extends Function>(
    target: object,
    propertyKey: number | string | symbol,
    descriptor?: TypedPropertyDescriptor<T>
): void | TypedPropertyDescriptor<T> {
    let value: T

    return {
        configurable: true,
        set(this: T, value_: Function): void {
            value = value_.bind(this)
        },
        get(this: T): T {
            if (!value) {
                if (!descriptor) {
                    return undefined as unknown as T
                }

                value = descriptor.value!.bind(this)
            }

            return value
        },
    }
}

globalify({ bind })
