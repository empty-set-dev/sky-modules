import globalify from 'sky/utilities/globalify'

declare global {
    function loadDefines(defines: Defines): void
}

namespace lib {
    export async function loadDefines(defines?: Defines): Promise<void> {
        if (defines == null) {
            return
        }

        Object.keys(defines).forEach(
            k => (local.defines[k] = { id: defines[k] } as { id: number; Class: Class })
        )
    }
}

globalify(lib)
