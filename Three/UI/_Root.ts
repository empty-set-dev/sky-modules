import globalify from '@sky-modules/core/globalify'

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

        constructor(dep: EffectDep) {
            this.effect = new Effect(dep, this)
            // this.effect.addContext(this)
        }

        updateZOrder(): this {
            // this.effect.emit('_updateZOrder', { z: 1000 }, ['z'])

            return this
        }
    }
}

globalify.namespace('UI', lib)
