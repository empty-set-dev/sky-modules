import globalify from 'sky/utilities/globalify'

declare global {
    namespace UI {
        type ContainerParams = UILib.ContainerParams
        type Container = UILib.Container
        const Container: typeof UILib.Container
    }
}

namespace UILib {
    export interface ContainerParams {
        x: number
        y: number
        w?: number
        h?: number
    }
    export class Container {
        readonly effect: Effect
        readonly sprite: Sprite

        constructor(deps: EffectDeps) {
            this.sprite = new Sprite(deps)
            this.effect = this.sprite.effect
        }

        add(element: { sprite: Sprite }): this {
            this.sprite.add(element.sprite)

            const uiRoot = this.sprite.effect.context(UI.Root)

            uiRoot.updateZOrder()

            return this
        }

        remove(element: { sprite: Sprite }): this {
            this.sprite.remove(element.sprite)

            const uiRoot = this.sprite.effect.context(UI.Root)

            uiRoot.updateZOrder()

            return this
        }
    }
}

globalify.namespace('UI', UILib)
