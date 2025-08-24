export interface SkyAppDescription {
    id: string
    target: 'web' | 'node' | 'universal'
    public?: string
}
export interface SkyAppParameters extends SkyAppDescription {
    path: string
}
export interface SkyWebApp extends SkyApp {
    target: 'web'
    public: string
}
export interface SkyUniversalApp extends SkyApp {
    target: 'universal'
    public: string
}
export default class SkyApp {
    id: string
    target: 'web' | 'node' | 'universal'
    path: string
    public?: string

    constructor(parameters: SkyAppParameters) {
        this.id = parameters.id
        this.target = parameters.target
        this.path = parameters.path
        this.public = parameters.public
    }
}
