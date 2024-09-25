import globalify from 'sky/helpers/globalify'

declare global {
    type resolve<T> = (result: T) => T

    interface Promise<T> {
        create(): [resolve: resolve<T>, promise: Promise<T>]
    }
}

Object.assign(Promise, {
    createPromise<T>(): [resolve: resolve<T>, promise: Promise<T>] {
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
