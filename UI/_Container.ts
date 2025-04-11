export {}

declare global {
    namespace UI {
        type ContainerParams = lib.ContainerParams
        type Container = lib.Container
        const Container: typeof lib.Container
    }
}

namespace lib {
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

        add(element: Sprite): this {
            this.sprite.add(element)

            const ui = this.sprite.effect.context(UI.Root)

            ui.updateZOrder()

            return this
        }

        remove(element: Sprite): this {
            this.sprite.remove(element)

            const ui = this.sprite.effect.context(UI.Root)

            ui.updateZOrder()

            return this
        }
    }
}

Object.assign(UI, lib)
