import './measures'

declare global {
    var seconds: number
    var minutes: number
    var hours: number
    var days: number
    var weeks: number

    interface time extends Number {
        get seconds(): time
        get minutes(): time
        get hours(): time
        get days(): time
        get weeks(): time
    }
    var time: (value: number, dimension?: number) => time
}

namespace module {
    export const { time, seconds, minutes, hours, days, weeks } = measures('time', [
        ['seconds', 1000],
        ['minutes', 60],
        ['hours', 60],
        ['days', 24],
        ['weeks', 7],
    ])
}

Object.assign(global, module)
