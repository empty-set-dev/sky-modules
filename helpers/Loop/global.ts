import globalify from 'sky/utilities/globalify'

import * as module from '.'

globalify({ Loop: module.default })

declare global {
    class Loop {
        readonly effect: Effect

        constructor(interval: Time, callback: (dt: Time) => void, deps: EffectDeps)
    }
}
