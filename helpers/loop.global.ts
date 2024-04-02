import globalify from 'utilities/globalify/-globalify'

import * as module from './loop'

globalify({ loop: module.default })

declare global {
    var loop: (
        interval: time,
        minInterval: time,
        callback: (dt: time) => Promise<void>
    ) => Promise<void>
}
