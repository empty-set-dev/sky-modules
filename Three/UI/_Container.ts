import globalify from '@sky-modules/core/globalify'

declare global {
    namespace UI {
        type ContainerParams = lib.ContainerParameters
        class Container extends lib.Container {}
    }
}

namespace lib {
    export interface ContainerParameters {
        x: number
        y: number
        w?: number
        h?: number
    }
    export class Container extends Sprite {
        add(element: Three.Object3D): this {
            super.add(element)

            const uiRoot = this.effect.context(UI.Root)

            uiRoot.updateZOrder()

            return this
        }

        remove(element: Three.Object3D): this {
            super.remove(element)

            const uiRoot = this.effect.context(UI.Root)

            uiRoot.updateZOrder()

            return this
        }
    }
}

globalify.namespace('UI', lib)
