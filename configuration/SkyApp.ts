export interface SkyAppDescription {
    target: 'web' | 'node' | 'universal'
    public?: string
}
export interface SkyAppParameters {
    target: 'web' | 'node' | 'universal'
    path: string
    public?: string
}
export default class SkyApp {
    target: 'web' | 'node' | 'universal'
    path: string
    public?: string

    constructor(parameters: SkyAppParameters) {
        this.target = parameters.target
        this.path = parameters.path
        this.public = parameters.public
    }
}
