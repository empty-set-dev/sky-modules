export default function bind<T extends Function>(
    target: object,
    propertyKey: number | string | symbol,
    descriptor?: TypedPropertyDescriptor<T>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
): any {
    const key = Symbol()

    return {
        configurable: true,
        set(this: T, value_: Function): void {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ;(this as any)[key] = value_.bind(this)
        },
        get(this: T): T {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            if ((this as any)[key] == null) {
                if (!descriptor) {
                    return undefined as never as T
                }

                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ;(this as any)[key] = descriptor.value!.bind(this)
            }

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return (this as any)[key]
        },
    }
}
