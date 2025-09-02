import globalify from 'sky/standard//globalify'

declare global {
    interface Modules {}
    const Modules: Modules

    const neededModule: typeof lib.neededModule
    const allowModule: typeof lib.allowModule
    const defineModule: typeof lib.defineModule
}
namespace local {
    // export const access: {[P in keyof Modules]: } = {}
}
namespace lib {
    export function neededModule<ModuleID extends keyof Modules>(
        moduleId: ModuleID
    ): Modules[ModuleID] {
        return Modules[moduleId]
    }
    export function allowModule(moduleId: keyof Modules) {}
    export function defineModule<ModuleID extends keyof Modules>(
        moduleId: ModuleID,
        module: Modules[ModuleID]
    ): void {
        Modules[moduleId] = module
    }
}

globalify(lib)

declare global {
    interface Modules {
        'sky.standard.modules': typeof import('sky/standard/modules')
    }
}

defineModule('sky.standard.modules', import('sky/standard/modules'))

const modules = neededModule('sky.standard.modules')
