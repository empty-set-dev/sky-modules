import 'features/effect/global'
import globalify from 'helpers/globalify'

import * as module from './-Loop'

globalify({ loop: module.default })

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
