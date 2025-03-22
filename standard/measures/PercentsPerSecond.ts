import './_measures'
import globalify from 'sky/utilities/globalify'

declare global {
    interface PercentsPerSecond extends Number, PercentsPerSecondID {}
    function PercentsPerSecond(value: number): PercentsPerSecond
}

class PercentsPerSecondID {
    private PercentsPerSecondID!: void
}

globalify(measures('PercentsPerSecond', []))
