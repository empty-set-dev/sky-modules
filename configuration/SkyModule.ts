export interface SkyModuleDescription {
    path: string
}
export interface SkyModuleParameters {
    path: string
}
export default class SkyModule {
    path: string

    constructor(parameters: SkyModuleParameters) {
        this.path = parameters.path
    }
}
