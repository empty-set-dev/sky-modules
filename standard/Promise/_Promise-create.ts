export {}

declare global {
    type resolve<T> = (result: T) => T

    interface PromiseConstructor {
        create<T = void>(): [promise: Promise<T>, resolve: resolve<T>]
    }
}

Promise.create = function create<T = void>(): [promise: Promise<T>, resolve: resolve<T>] {
    let resolve!: resolve<T>
    const promise = new Promise<T>(
        resolve_ =>
            (resolve = (result: T): T => {
                resolve_(result)
                return result
            })
    )

    return [promise, resolve]
}
