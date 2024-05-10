import '../measures'
import globalify from 'helpers/globalify'

declare global {
    interface PercentsPerSecond extends Number, PercentsPerSecondID {}
    function PercentsPerSecond(value: number): PercentsPerSecond
}

class PercentsPerSecondID {
    private PercentsPerSecondID: void
}

globalify(measures('PercentsPerSecond', []))
