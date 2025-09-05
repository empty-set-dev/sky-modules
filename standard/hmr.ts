/// <reference types="vite/client" />
import globalify from 'sky/standard/globalify'

declare global {
    const isHot: typeof lib.isHot
}

namespace local {
    export let isHot = false
}

namespace lib {
    export function isHot(): boolean {
        return local.isHot
    }

    // export function acceptHotModule(newModule: object) {
    //     console.log('HMR: module updated', newModule)
    // }

    // export function disposeHotModule(oldModule) {
    //     console.log('HMR: disposing old module', oldModule)
    // }
}

globalify(lib)
