import globalify from 'sky/core/globalify'

import * as lib from '.'

globalify({ Timer: lib.default, ...lib })

declare global {
    abstract class BaseOfTimer extends lib.BaseOfTimer {}
    class Timer extends lib.default {}
    class TimeoutTimer extends lib.TimeoutTimer {}
    class IntervalTimer extends lib.IntervalTimer {}
    class WaitTimer extends lib.WaitTimer {}
}
