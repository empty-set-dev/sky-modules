import globalify from 'utilities/globalify'

declare global {
    type resolve<R> = (result: R) => R

    interface promise {}
    var promise: (<R = void>() => [resolve: resolve<R>, Promise<R>]) & promise
}

namespace module {
    export function promise<R>(): [resolve<R>, Promise<R>] {
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
