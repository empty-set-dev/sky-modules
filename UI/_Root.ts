export {}

declare global {
    namespace UI {
        type Root = lib.Root
        const Root: typeof lib.Root
    }
}

namespace lib {
    export namespace Root {}

    export class Root extends Effect {
        static context = true

        updateZOrder(): this {
            this.emit('__updateZOrder', { z: 1000 }, null, ['z'])

            return this
        }
    }
}

Object.assign(UI, lib)
