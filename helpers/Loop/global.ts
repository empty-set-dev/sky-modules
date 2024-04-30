import 'features/link'
import globalify from 'helpers/globalify'

import * as module from './-Loop'

globalify({ loop: module.default })

declare global {
    class Loop extends Effect {
        constructor(
            interval: time,
            minInterval: time,
            callback: (dt: time) => void,
            deps: EffectDeps
        )
    }
}
