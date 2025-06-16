import SkyApp from './_SkyApp'
import { SkyModule } from './_SkyModule'

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
