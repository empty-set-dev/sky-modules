import globalify from 'sky/utilities/globalify'

import * as pkg from '.'

globalify({ Loop: pkg.default })

declare global {
    class Loop extends Effect {
        constructor(
            interval: Time,
            minInterval: Time,
            callback: (dt: Time) => void,
            deps: EffectDeps
        )
    }
}
