import './_defineMeasures'

declare global {
    interface Number {
        measure: string
        get asNanoseconds(): number
        get asMilliseconds(): number
        get asDeciseconds(): number
        get asSeconds(): number
        get asMinutes(): number
        get asHours(): number
        get asDays(): number
        get asWeeks(): number
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
