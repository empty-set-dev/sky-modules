export interface SkyModuleDescription {
    id: string
    path: string
}
export interface SkyModuleParameters extends SkyModuleDescription {}
export default class SkyModule {
    id: string
    path: string

    constructor(parameters: SkyModuleParameters) {
        this.id = parameters.id
        this.path = parameters.path
    }
}
