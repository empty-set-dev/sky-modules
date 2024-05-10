import '../measures'
import globalify from 'helpers/globalify'

declare global {
    interface Percents extends Number {}
    function Percents(value: number): Percents
}

globalify(measures('Percents', []))
