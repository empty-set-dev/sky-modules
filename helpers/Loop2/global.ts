import globalify from 'helpers/globalify'

import * as module from './-loop'

globalify({ loop: module.default })

declare global {
    const loop: (
        interval: time,
        minInterval: time,
        callback: (dt: time) => Promise<void>,
        deps: EffectDeps
    ) => Promise<void>
}
