import globalify from 'sky/utilities/globalify'

import local from './__local'

declare global {
    function loadDefines(defines: local.Defines): void
}

namespace lib {
    define('sky.standard.loadDefines', loadDefines)
    export async function loadDefines(defines?: local.Defines): Promise<void> {
        if (defines == null) {
            return
        }

        Object.keys(defines).forEach(k => {
            local.loadedDefines[k] = defines[k]
            local.uniqueId = Math.max(local.uniqueId, defines[k])
        })
    }
}

globalify(lib)
