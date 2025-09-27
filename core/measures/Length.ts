import './_defineMeasures'

declare global {
    interface Number {
        get asNanometers(): Length
        get asMillimeters(): Length
        get asDecimeters(): Length
        get asMeters(): Length
        get asKilometers(): Length
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
