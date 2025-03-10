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
    export class Container extends Sprite {
        constructor(deps: EffectDeps) {
            super(deps)

            this.view.renderOrder = 1000
        }

        add(element: Sprite): this {
            this.view.add(element.view)

            this.__emitUpdateZOrder()

            return this
        }

        remove(element: Sprite): this {
            this.view.remove(element.view)

            return this
        }

        __emitUpdateZOrder(): this {
            this.emit('__updateZOrder', { z: this.view.renderOrder + 1 }, null, ['z'])

            return this
        }
    }
}

Object.assign(UI, lib)
