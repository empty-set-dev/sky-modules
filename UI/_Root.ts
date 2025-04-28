import globalify from 'sky/utilities/globalify'

declare global {
    namespace UI {
        class Root extends UILib.Root {}
    }
}

namespace UILib {
    export namespace Root {}

    export class Root {
        static context = true

        readonly effect: Effect

        constructor(deps: EffectDeps) {
            this.effect = new Effect(deps, this)
            this.effect.addContext(this)
        }

        updateZOrder(): this {
            this.effect.emit('__updateZOrder', { z: 1000 }, ['z'])

            return this
        }
    }
}

globalify.namespace('UI', UILib)
