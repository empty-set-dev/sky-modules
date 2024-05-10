import '../measures'
import globalify from 'helpers/globalify'

declare global {
    const nanoseconds: number
    const milliseconds: number
    const deciseconds: number
    const seconds: number
    const minutes: number
    const hours: number
    const days: number
    const weeks: number

    interface Time extends Number {
        get nanoseconds(): number
        get milliseconds(): number
        get deciseconds(): number
        get seconds(): number
        get minutes(): number
        get hours(): number
        get days(): number
        get weeks(): number
    }
    function Time(value: number, dimension?: number): Time
}

globalify(
    measures('Time', [
        ['nanoseconds', 0.000000001],
        ['milliseconds', 1000000],
        ['deciseconds', 100],
        ['seconds', 10],
        ['minutes', 60],
        ['hours', 60],
        ['days', 24],
        ['weeks', 7],
    ])
)
