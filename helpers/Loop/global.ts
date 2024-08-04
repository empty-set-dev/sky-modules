import 'sky/features/effect/global'
import globalify from 'sky/helpers/globalify'

import * as lib from './-Loop'

globalify({ Loop: lib.default })

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
