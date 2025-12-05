export {}

declare global {
    namespace Sky {
        interface WorkspaceConfig {
            name: string
            id: string
            scripts?: boolean | Record<string, string>
            folders?: Record<string, string>
        }

        type Workspace = lib.Workspace
        const Workspace: typeof lib.Workspace
    }
}

namespace lib {
    export class Workspace {
        name: string
        nameId: string
        id: string
        scripts?: boolean | Record<string, string>
        folders?: Record<string, string>

        constructor(config: Sky.WorkspaceConfig) {
            this.name = config.name
            this.nameId = this.name.toLocaleLowerCase().replaceAll(' ', '-')
            this.id = config.id
            config.scripts && (this.scripts = config.scripts)
            config.folders && (this.folders = config.folders)
        }
    }
}

typeof Sky === 'undefined' && Object.assign(global, { Sky: {} })
Object.assign(Sky, lib)
