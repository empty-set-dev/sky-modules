import globalify from './globalify/globalify'

declare global {
    const canClone: typeof lib.canClone
}

namespace lib {
    export function canClone(object: unknown): boolean {
        try {
            structuredClone(object)
            return true
        } catch (error: unknown) {
            error
            return false
        }
    }
}

globalify(lib)
