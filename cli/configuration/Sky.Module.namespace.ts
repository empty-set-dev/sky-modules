export {}

declare global {
    namespace Sky {
        interface ModuleBase {
            id: string
            mitosis?: string[]
            package?: string
        }
        interface ModuleDescription extends ModuleBase {}
        interface ModuleParameters extends ModuleBase {
            path: string
        }

        interface ModuleConfig {
            name: string
            description?: string
            access?: 'public' | 'restricted'
            keywords?: string[]
            modules?: string[]
            dependencies?: Record<string, string>
            peerDependencies?: Record<string, string>
        }

        type Module = lib.Module
        const Module: typeof lib.Module
    }
}

namespace lib {
    export class Module {
        id: string
        path: string

        constructor(parameters: Sky.ModuleParameters) {
            this.id = parameters.id
            this.path = parameters.path
        }
    }
}

typeof Sky === 'undefined' && Object.assign(global, { Sky: {} })
Object.assign(Sky, lib)
