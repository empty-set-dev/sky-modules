import globalify from 'helpers/globalify'

declare global {
    type resolve<R> = (result: R) => R

    interface createPromise {}
    const createPromise: (<R = void>() => [resolve: resolve<R>, Promise<R>]) & createPromise
}

namespace module {
    export function createPromise<R>(): [resolve<R>, Promise<R>] {
        let resolve: resolve<R>
        const promise = new Promise<R>(
            r =>
                (resolve = (result: R): R => {
                    r(result)
                    return result
                })
        )

        return [resolve, promise]
    }
}

globalify(module)
