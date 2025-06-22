import globalify from 'sky/utilities/globalify'

declare global {
    function async(callback: () => Promise<void> | void): Promise<void>
}

namespace lib {
    export function async(callback: () => Promise<void> | void): Promise<void> {
        // eslint-disable-next-line no-async-promise-executor
        return new Promise<void>(async resolve => {
            await callback()
            resolve()
        })
    }
}

globalify(lib)
