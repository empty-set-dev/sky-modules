import globalify from 'sky/standard/globalify'

declare global {
    interface Modules {}

    const neededModule: typeof lib.neededModule
    const iAm: typeof lib.iAm
}
namespace local {
    export const modules: Partial<Modules> = {}
}
namespace lib {
    export function neededModule<ModuleID extends keyof Modules>(
        moduleId: ModuleID
    ): Modules[ModuleID] {
        if (local.modules[moduleId] == null) {
            throw Error(`needed ${moduleId}`)
        }

        return local.modules[moduleId]
    }
    export function iAm<ModuleID extends keyof Modules>(
        moduleID: ModuleID,
        module: Modules[ModuleID]
    ): void {
        local.modules[moduleID] = module
    }
}

globalify(lib)
