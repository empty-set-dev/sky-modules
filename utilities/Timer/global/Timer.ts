import globalify from '@sky-modules/core/globalify'

import * as lib from '.'

globalify({ Timer: lib.default, ...lib })

declare global {
    abstract class TimerBase extends lib.TimerBase {}
    class Timer extends lib.default {}
    class TimeoutTimer extends lib.TimeoutTimer {}
    class IntervalTimer extends lib.IntervalTimer {}
    class WaitTimer extends lib.WaitTimer {}
}
