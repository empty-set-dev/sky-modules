import './_measures'
import globalify from 'sky/utilities/globalify'

declare global {
    const nanoseconds: number
    const milliseconds: number
    const deciseconds: number
    const seconds: number
    const minutes: number
    const hours: number
    const days: number
    const weeks: number

    interface Time extends Number, TimeID {
        get nanoseconds(): number
        get milliseconds(): number
        get deciseconds(): number
        get seconds(): number
        get minutes(): number
        get hours(): number
        get days(): number
        get weeks(): number
    }
    function Time(value: number, dimension: number): Time
}

class TimeID {
    private TimeID!: void
}

globalify(
    measures('Time', [
        ['nanoseconds', 0.000000001],
        ['milliseconds', 0.001],
        ['deciseconds', 0.1],
        ['seconds', 1],
        ['minutes', 60],
        ['hours', 60 * 60],
        ['days', 24 * 60 * 60],
        ['weeks', 7 * 24 * 60 * 60],
    ])
)
