import globalify from 'sky/utilities/globalify'

declare global {
    function async(callback: () => Promise<void> | void): Promise<void>
}

namespace module {
    export function async(callback: () => Promise<void> | void): Promise<void> {
        return new Promise<void>(resolve => resolve()).then(callback)
    }
}

globalify(module)
