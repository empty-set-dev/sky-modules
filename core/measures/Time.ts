import './defineMeasures'

declare global {
    interface Number {
        measure: string
        // [ ] Renaming measures as
        get nanoseconds(): Time
        get milliseconds(): Time
        get deciseconds(): Time
        get seconds(): Time
        get minutes(): Time
        get hours(): Time
        get days(): Time
        get weeks(): Time
    }
    interface Time extends Number, TimeID {
        get inNanoseconds(): number
        get inMilliseconds(): number
        get inDeciseconds(): number
        get inSeconds(): number
        get inMinutes(): number
        get inHours(): number
        get inDays(): number
        get inWeeks(): number
    }
}

class TimeID {
    private TimeID = true
}

defineMeasures('Time', [
    ['Nanoseconds', 0.000000001],
    ['Milliseconds', 0.001],
    ['Deciseconds', 0.1],
    ['Seconds', 1],
    ['Minutes', 60],
    ['Hours', 60 * 60],
    ['Days', 24 * 60 * 60],
    ['Weeks', 7 * 24 * 60 * 60],
])
