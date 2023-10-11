export {}

declare global {
    function promise<R = void>(): [(result: R) => R, Promise<R>]
}

namespace module {
    export function promise<R>(): [(result: R) => R, Promise<R>] {
        let resolve: (result: R) => R
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
Object.assign(Promise, module)
