import './_measures'
import globalify from 'sky/helpers/globalify'

declare global {
    interface Percents extends Number, PercentsID {}
    function Percents(value: number): Percents
}

class PercentsID {
    private PercentsID!: void
}

globalify(measures('Percents', []))
