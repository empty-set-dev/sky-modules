import '../measures'
import globalify from 'helpers/globalify'

declare global {
    interface Percents extends Number, PercentsID {}
    function Percents(value: number): Percents
}

class PercentsID {
    private PercentsID: void
}

globalify(measures('Percents', []))
