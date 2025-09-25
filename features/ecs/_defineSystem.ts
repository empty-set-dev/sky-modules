import globalify from 'sky/core/globalify'

import local from './__local'

declare global {
    function defineSystem(systemName: string, Class: Class): void
}

namespace lib {
    export function defineSystem(systemName: string, Class: new () => System): void {
        local.systems[systemName] = Class
    }
}

globalify(lib)
