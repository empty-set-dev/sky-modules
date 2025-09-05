import 'sky/platform/initial'
import 'sky/standard/extends_type'

declare global {
    interface Modules {}

    const getModule: typeof lib.getModule
    const iAm: typeof lib.iAm
}
namespace local {
    export const moduleLoadings: { [P in keyof Modules]?: Promise<Modules[P]> } = {}
}

namespace lib {
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
        extends_type<{ [moduleID]: Promise<Modules[ModuleID]> }>(local.moduleLoadings)
        local.moduleLoadings[moduleID] = moduleLoading
    }

    export async function getModule<ModuleID extends keyof Modules>(
        moduleID: ModuleID
    ): Promise<Modules[ModuleID]> {
        if (local.moduleLoadings[moduleID] == null) {
            throw Error(`unexpected module dependency: ${moduleID}`)
        }

        extends_type<{ [moduleID]: Promise<Modules[ModuleID]> }>(local.moduleLoadings)
        return local.moduleLoadings[moduleID]
    }

    export async function allowModule<ModuleID extends keyof Modules>(
        moduleID: ModuleID,
        moduleLoading: Promise<Modules[ModuleID]>
    ): Promise<void> {
        extends_type<{ [moduleID]: Promise<Modules[ModuleID]> }>(local.moduleLoadings)
        local.moduleLoadings[moduleID] = moduleLoading
    }
}

export const getModule = lib.getModule
export const iAm = lib.iAm

Object.assign(global, lib)
