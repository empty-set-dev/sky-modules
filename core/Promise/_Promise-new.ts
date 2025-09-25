export {}

declare global {
    type resolve<T> = (result: T) => T

    interface PromiseConstructor {
        'new'<T = void>(): [promise: Promise<T>, resolve: resolve<T>]
    }
}

Promise.new = function newPromise<T = void>(): [promise: Promise<T>, resolve: resolve<T>] {
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
