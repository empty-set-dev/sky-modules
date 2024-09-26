export {}

declare global {
    type resolve<T> = (result: T) => T

    interface PromiseConstructor {
        create<T>(): [resolve: resolve<T>, promise: Promise<T>]
    }
}

Object.assign(Promise, {
    create<T>(): [resolve: resolve<T>, promise: Promise<T>] {
        let resolve!: resolve<T>
        const promise = new Promise<T>(
            resolve_ =>
                (resolve = (result: T): T => {
                    resolve_(result)
                    return result
                })
        )

        return [resolve, promise]
    },
})
