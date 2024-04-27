import globalify from 'helpers/globalify/-globalify'

import * as module from './-loop'

globalify({ loop: module.default })

declare global {
    const loop: (
        interval: time,
        minInterval: time,
        callback: (dt: time) => Promise<void>
    ) => Promise<void>
}
