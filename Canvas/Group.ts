import EffectDep from '@sky-modules/features/effect/EffectDep'

import Object2D from './Object2D'

export default class Group extends Object2D {
    static context = true

    readonly isGroup: boolean = true

    constructor(dep: EffectDep) {
        super(dep)
    }

    clone(): Group {
        const cloned = new Group(this.dep)
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
