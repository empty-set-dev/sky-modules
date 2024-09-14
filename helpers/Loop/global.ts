import 'sky/features/effect/global'
import globalify from 'sky/helpers/globalify'

import * as pkg from './-Loop'

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
