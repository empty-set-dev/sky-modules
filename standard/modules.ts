export {}

declare global {
    interface Modules {}

    const getModule: typeof lib.getModule
    const iAm: typeof lib.iAm
}
namespace local {
    export const modules: Partial<Modules> = {}
}
namespace lib {
    export function getModule<ModuleID extends keyof Modules>(
        moduleId: ModuleID
    ): Modules[ModuleID] {
        if (local.modules[moduleId] == null) {
            throw Error(`unexpected module dependency: ${moduleId}`)
        }

        return local.modules[moduleId]
    }
    export function iAm<ModuleID extends keyof Modules>(
        moduleID: ModuleID,
        module: Modules[ModuleID],
        dependencies?: { needs: (keyof Modules)[] }
    ): void {
        dependencies &&
            dependencies.needs.forEach(dependency => {
                if (local.modules[dependency] == null) {
                    throw Error(
                        `«${moduleID}» need «${dependency}», but «${dependency}» not imported`
                    )
                }
            })
        local.modules[moduleID] = module
    }
}

Object.assign(global, lib)
