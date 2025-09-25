import 'sky/platform/initial'
import 'sky/standard/as'

import globalify from './globalify'

declare global {
    interface Modules {}

    const iAm: typeof lib.iAm
    const getModule: typeof lib.getModule
    const allowModule: typeof lib.allowModule
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
                    throw new Error(
                        `«${moduleID}» need «${dependency}», but «${dependency}» not imported`
                    )
                }
            })
        as<{ [moduleID]: Promise<Modules[ModuleID]> }>(local.moduleLoadings)
        local.moduleLoadings[moduleID] = moduleLoading
    }

    export async function getModule<ModuleID extends keyof Modules>(
        moduleID: ModuleID
    ): Promise<Modules[ModuleID]> {
        const module: void | Promise<Modules[ModuleID]> = local.moduleLoadings[moduleID]

        if (module == null) {
            throw new Error(`unexpected module dependency: ${moduleID}`)
        }

        return module
    }

    export async function allowModule<ModuleID extends keyof Modules>(
        moduleID: ModuleID,
        moduleLoading: Promise<Modules[ModuleID]>
    ): Promise<void> {
        as<{ [moduleID]: Promise<Modules[ModuleID]> }>(local.moduleLoadings)
        local.moduleLoadings[moduleID] = moduleLoading
    }
}

globalify(lib)
