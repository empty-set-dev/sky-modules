import '../measures'
import globalify from 'helpers/globalify'

declare global {
    interface PercentsPerSecond extends Number {}
    function PercentsPerSecond(value: number): PercentsPerSecond
}

globalify(measures('PercentsPerSecond', []))
