import './_defineMeasures'

declare global {
    interface Number {
        get asNanometers(): number
        get asMillimeters(): number
        get asDecimeters(): number
        get asMeters(): number
        get asKilometers(): number
    }
    interface Length extends Number, LengthID {
        get inNanometers(): number
        get inMillimeters(): number
        get inDecimeters(): number
        get inMeters(): number
        get inKilometers(): number
    }
}

class LengthID {
    private LengthID = true
}

defineMeasures('Length', [
    ['Nanometers', 0.000000001],
    ['Millimeters', 0.001],
    ['Decimeters', 0.1],
    ['Meters', 1],
    ['Kilometers', 1000],
])
