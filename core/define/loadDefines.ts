import local from './local'

import './define'

declare global {
    function loadDefines(defines: local.Defines): void
}

namespace lib {
    define('sky.core.loadDefines', loadDefines)
    export async function loadDefines(defines: local.Defines): Promise<void> {
        Object.keys(defines).forEach(k => {
            local.loadedDefines[k] = defines[k]
            local.uniqueId = Math.max(local.uniqueId, defines[k])
            local.staticMaxId = local.uniqueId
        })
    }
}

Object.assign(global, lib)
