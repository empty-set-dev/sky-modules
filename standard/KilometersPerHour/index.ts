import '../measures'
import globalify from 'helpers/globalify'

declare global {
    interface KilometersPerHour extends Number {}
    function KilometersPerHour(value: number): KilometersPerHour
}

globalify(measures('KilometersPerHour', []))
