import globalify from 'sky/standard/globalify'

import local from './__local'

import './_define'

declare global {
    function loadDefines(defines: local.Defines): void
}

namespace lib {
    define('sky.standard.loadDefines', loadDefines)
    export async function loadDefines(defines: local.Defines): Promise<void> {
        Object.keys(defines).forEach(k => {
            local.loadedDefines[k] = defines[k]
            local.uniqueId = Math.max(local.uniqueId, defines[k])
            local.staticMaxId = local.uniqueId
        })
    }
}

globalify(lib)
