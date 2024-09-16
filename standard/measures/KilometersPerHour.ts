import '.'
import globalify from 'sky/helpers/globalify'

declare global {
    interface KilometersPerHour extends Number, KilometersPerHourID {}
    function KilometersPerHour(value: number): KilometersPerHour
}

class KilometersPerHourID {
    private KilometersPerHourID!: void
}

globalify(measures('KilometersPerHour', []))
