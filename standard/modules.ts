import 'sky/platform/initial'

declare global {
    interface Modules {}

    const getModule: typeof lib.getModule
    const iAm: typeof lib.iAm
}
namespace local {
    export const moduleLoadings: { [P in keyof Modules]?: Promise<Modules[P]> } = {}
}

namespace lib {
    export function getModule<ModuleID extends keyof Modules>(
        moduleId: ModuleID
    ): Promise<Modules[ModuleID]> {
        if (local.moduleLoadings[moduleId] == null) {
            throw Error(`unexpected module dependency: ${moduleId}`)
        }

        return local.moduleLoadings[moduleId]
    }
    export function iAm<ModuleID extends keyof Modules>(
        moduleID: ModuleID,
        moduleLoading: Promise<Modules[ModuleID]>,
        dependencies?: { needs: (keyof Modules)[] }
    ): void {
        dependencies &&
            dependencies.needs.forEach(dependency => {
                if (local.moduleLoadings[dependency] == null) {
                    throw Error(
                        `«${moduleID}» need «${dependency}», but «${dependency}» not imported`
                    )
                }
            })
        extends_type<{ [P in ModuleID]: Promise<Modules[P]> }>(local.moduleLoadings)
        local.moduleLoadings[moduleID] = moduleLoading
    }
}

export const getModule = lib.getModule
export const iAm = lib.iAm

Object.assign(global, lib)
