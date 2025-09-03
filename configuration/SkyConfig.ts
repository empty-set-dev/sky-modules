import SkyApp, { SkyAppDescription, SkyAppParameters } from './SkyApp'
import SkyModule, { SkyModuleDescription, SkyModuleParameters } from './SkyModule'

export interface SkyConfigDescription {
    name: string
    id: string
    modules: Record<string, SkyModuleDescription>
    examples: Record<string, SkyAppDescription>
    apps: Record<string, SkyAppDescription>
    scripts: boolean | Record<string, string>
    folders?: Record<string, string>
}
export interface SkyConfigParameters extends SkyConfigDescription {
    nameId: string
    modules: Record<string, SkyModuleParameters>
    examples: Record<string, SkyAppParameters>
    apps: Record<string, SkyAppParameters>
}
export default class SkyConfig {
    name: string
    nameId: string
    id: string
    modules: Record<string, SkyModule>
    examples: Record<string, SkyApp>
    apps: Record<string, SkyApp>
    scripts: boolean | Record<string, string>
    folders?: Record<string, string>

    constructor(parameters: SkyConfigParameters) {
        this.name = parameters.name
        this.nameId = this.name.toLocaleLowerCase().replaceAll(' ', '-')
        this.id = parameters.id
        this.modules = parameters.modules
        this.examples = parameters.examples
        this.apps = parameters.apps
        this.scripts = parameters.scripts

        if (parameters.folders != null) {
            this.folders = parameters.folders
        }
    }
}
