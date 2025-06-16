import SkyApp, { SkyAppDescription } from './SkyApp'
import SkyModule, { SkyModuleDescription } from './SkyModule'

export interface SkyConfigDescription {
    name: string
    package?: string
    modules: Record<string, SkyModuleDescription>
    examples: Record<string, SkyAppDescription>
    apps: Record<string, SkyAppDescription>
    scripts: Record<string, string> | boolean
}
export interface SkyConfigParameters {
    name: string
    package?: string
    modules: Record<string, SkyModule>
    examples: Record<string, SkyApp>
    apps: Record<string, SkyApp>
    scripts: Record<string, string> | boolean
}
export default class SkyConfig {
    name: string
    package?: string
    modules: Record<string, SkyModule>
    examples: Record<string, SkyApp>
    apps: Record<string, SkyApp>
    scripts: Record<string, string> | boolean

    constructor(parameters: SkyConfigParameters) {
        this.name = parameters.name
        this.package = parameters.package
        this.modules = parameters.modules
        this.examples = parameters.examples
        this.apps = parameters.apps
        this.scripts = parameters.scripts
    }
}
