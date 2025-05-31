import globalify from 'sky/utilities/globalify'

declare global {
    namespace UI {
        type ContainerParams = module.ContainerParameters
        class Container extends module.Container {}
    }
}

namespace module {
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

globalify.namespace('UI', module)
