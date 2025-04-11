export {}

declare global {
    namespace UI {
        type Root = lib.Root
        const Root: typeof lib.Root
    }
}

namespace lib {
    export namespace Root {}

    export class Root {
        static context = true

        readonly effect: Effect

        constructor(deps: EffectDeps) {
            this.effect = new Effect(deps)
        }

        updateZOrder(): this {
            this.effect.emit('__updateZOrder', { z: 1000 }, null, ['z'])

            return this
        }
    }
}

Object.assign(UI, lib)
