import globalify from 'sky/utilities/globalify'

declare global {
    const singleton: typeof lib.singleton
}

namespace lib {
    export function singleton(target: Class): void {
        if (!extends_type<Record<string, object>>(global)) {
            return null!
        }

        global[`${target.name[0].toLowerCase()}${target.name.slice(1)}`] = new target()
        return target as void & Class
    }
}

globalify(lib)
