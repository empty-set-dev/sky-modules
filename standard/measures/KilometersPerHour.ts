import './_measures'
import globalify from 'sky/utilities/globalify'

declare global {
    interface KilometersPerHour extends Number, KilometersPerHourID {}
    function KilometersPerHour(value: number): KilometersPerHour
}

class KilometersPerHourID {
    private KilometersPerHourID!: void
}

globalify(measures('KilometersPerHour', []))
