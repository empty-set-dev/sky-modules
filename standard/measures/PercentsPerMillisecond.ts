import './_measures'
import globalify from 'sky/utilities/globalify'

declare global {
    interface PercentsPerMillisecond extends Number, PercentsPerMillisecondID {}
    function PercentsPerMillisecond(value: number): PercentsPerMillisecond
}

class PercentsPerMillisecondID {
    private PercentsPerMillisecondID!: void
}

globalify(measures('PercentsPerMillisecond', []))
