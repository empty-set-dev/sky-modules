import SkyApp, { SkyAppDescription, SkyAppParameters } from './SkyApp'
import SkyModule, { SkyModuleDescription, SkyModuleParameters } from './SkyModule'

export interface SkyConfigDescription {
    name: string
    package?: string
    modules: Record<string, SkyModuleDescription>
    examples: Record<string, SkyAppDescription>
    apps: Record<string, SkyAppDescription>
    scripts: Record<string, string> | boolean
    folders: Record<string, string>
}
export interface SkyConfigParameters extends SkyConfigDescription {
    modules: Record<string, SkyModuleParameters>
    examples: Record<string, SkyAppParameters>
    apps: Record<string, SkyAppParameters>
}
export default class SkyConfig {
    name: string
    package?: string
    modules: Record<string, SkyModule>
    examples: Record<string, SkyApp>
    apps: Record<string, SkyApp>
    scripts: Record<string, string> | boolean
    folders: Record<string, string>

    constructor(parameters: SkyConfigParameters) {
        this.name = parameters.name
        this.package = parameters.package
        this.modules = parameters.modules
        this.examples = parameters.examples
        this.apps = parameters.apps
        this.scripts = parameters.scripts
        this.folders = parameters.folders
    }
}
