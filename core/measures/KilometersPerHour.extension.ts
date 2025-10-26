import '../defineMeasures'

declare global {
    interface Number {
        get kilometersPerHour(): KilometersPerHour
    }
    interface KilometersPerHour extends Number, KilometersPerHourId {
        get inKilometersPerHour(): number
    }
}

class KilometersPerHourId {
    private KilometersPerHourID = true
}

defineMeasures('KilometersPerHour', [['KilometersPerHour', 1]])
