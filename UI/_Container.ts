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
        add(element: Sprite): this {
            this.view.add(element.view)

            const ui = this.context(UI.Root)

            ui.updateZOrder()

            return this
        }

        remove(element: Sprite): this {
            this.view.remove(element.view)

            const ui = this.context(UI.Root)

            ui.updateZOrder()

            return this
        }
    }
}

Object.assign(UI, lib)
