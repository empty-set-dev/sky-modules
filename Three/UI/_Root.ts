import globalify from 'sky/core/globalify'

declare global {
    namespace UI {
        class Root extends lib.Root {}
    }
}

namespace lib {
    export namespace Root {}

    export class Root {
        static context = true

        readonly effect: Effect

        constructor(deps: EffectDeps) {
            this.effect = new Effect(deps, this)
            this.effect.addContext(this)
        }

        updateZOrder(): this {
            this.effect.emit('_updateZOrder', { z: 1000 }, ['z'])

            return this
        }
    }
}

globalify.namespace('UI', lib)
