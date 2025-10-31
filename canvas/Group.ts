import Object2D from './Object2D'

export default class Group extends Object2D {
    static context = true

    readonly isGroup: boolean = true

    constructor() {
        super()
    }

    clone(): Group {
        const cloned = new Group()
        cloned.position = this.position.clone()
        cloned.rotation = this.rotation
        cloned.scale = this.scale.clone()
        cloned.visible = this.visible
        cloned.id = this.id
        cloned.name = this.name

        // Clone children
        for (const child of this.children) {
            cloned.add(child.clone())
        }

        return cloned
    }
}
