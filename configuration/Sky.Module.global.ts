export {}

declare global {
    namespace Sky {
        interface BaseOfModule {
            id: string
            path: string
        }
        interface ModuleDescription extends BaseOfModule {}
        interface ModuleParameters extends BaseOfModule {}
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
