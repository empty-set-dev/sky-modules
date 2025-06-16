import globalify from 'sky/utilities/globalify'

import * as lib from '.'

globalify({ Loop: lib.default })

declare global {
    class Loop {
        readonly effect: Effect

        constructor(interval: Time, callback: (dt: Time) => void, deps: EffectDeps)
    }
}
