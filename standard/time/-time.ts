import '../measures'
import globalify from 'helpers/globalify'

declare global {
    const seconds: number
    const minutes: number
    const hours: number
    const days: number
    const weeks: number

    interface time extends Number, timeTypeId {
        get seconds(): time
        get minutes(): time
        get hours(): time
        get days(): time
        get weeks(): time
    }
    const time: (value: number, dimension?: number) => time
}

class timeTypeId {
    private abstract: timeTypeId
}

globalify(
    measures('time', [
        ['seconds', 1000],
        ['minutes', 60],
        ['hours', 60],
        ['days', 24],
        ['weeks', 7],
    ])
)
