import globalify from 'helpers/globalify'

declare global {
    type resolve<T> = (result: T) => T

    function createPromise<T>(): [resolve: resolve<T>, promise: Promise<T>]
}

namespace module {
    export function createPromise<T>(): [resolve: resolve<T>, promise: Promise<T>] {
        let resolve: resolve<T>
        const promise = new Promise<T>(
            resolve_ =>
                (resolve = (result: T): T => {
                    resolve_(result)
                    return result
                })
        )

        return [resolve, promise]
    }
}

globalify(module)
