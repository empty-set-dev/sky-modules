import './Sky.App.global'
import './Sky.Module.global'

declare global {
    namespace Sky {
        interface BaseOfConfig {
            name: string
            id: string
            slices?: Record<string, Sky.Slice>
            scripts?: boolean | Record<string, string>
            folders?: Record<string, string>
        }
        interface ConfigDescription extends BaseOfConfig {
            modules: Record<string, Sky.ModuleDescription>
            examples: Record<string, Sky.AppDescription>
            apps: Record<string, Sky.AppDescription>
        }
        interface ConfigParameters extends BaseOfConfig {
            modules: Record<string, Sky.ModuleParameters>
            examples: Record<string, Sky.AppParameters>
            apps: Record<string, Sky.AppParameters>
        }
        type Config = lib.Config
        const Config: typeof lib.Config
    }
}

namespace lib {
    export class Config {
        name: string
        nameId: string
        id: string
        modules: Record<string, Sky.ModuleParameters>
        examples: Record<string, Sky.AppParameters>
        apps: Record<string, Sky.AppParameters>
        scripts?: boolean | Record<string, string>
        folders?: Record<string, string>

        constructor(parameters: Sky.ConfigParameters) {
            this.name = parameters.name
            this.nameId = this.name.toLocaleLowerCase().replaceAll(' ', '-')
            this.id = parameters.id
            this.modules = parameters.modules
            this.examples = parameters.examples
            this.apps = parameters.apps
            parameters.scripts && (this.scripts = parameters.scripts)
            parameters.folders && (this.folders = parameters.folders)
        }
    }
}

typeof Sky === 'undefined' && Object.assign(global, { Sky: {} })
Object.assign(Sky, lib)
