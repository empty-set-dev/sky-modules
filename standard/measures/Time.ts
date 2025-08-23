import './_defineMeasures'

declare global {
    interface Number {
        measure: string
        get asNanoseconds(): number
        get inNanoseconds(): number
        get asMilliseconds(): number
        get inMilliseconds(): number
        get asDeciseconds(): number
        get inDeciseconds(): number
        get asSeconds(): number
        get inSeconds(): number
        get asMinutes(): number
        get inMinutes(): number
        get asHours(): number
        get inHours(): number
        get inDays(): number
        get asDays(): number
        get asWeeks(): number
        get inWeeks(): number
    }
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
