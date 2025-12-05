import globalify from '@sky-modules/core/globalify'

import Timer, * as imports from '../Timer'

declare global {
    const Timer: typeof imports.default
    type Timer = typeof imports.default
    const TimeoutTimer: typeof imports.TimeoutTimer
    const IntervalTimer: typeof imports.IntervalTimer
    const WaitTimer: typeof imports.WaitTimer
}

globalify({ Timer, ...imports })
