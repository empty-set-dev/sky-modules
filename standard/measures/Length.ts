import './_defineMeasures'

declare global {
    interface Number {
        get asNanometers(): number
        get inNanometers(): number
        get asMillimeters(): number
        get inMillimeters(): number
        get asDecimeters(): number
        get inDecimeters(): number
        get asMeters(): number
        get inMeters(): number
        get asKilometers(): number
        get inKilometers(): number
    }
}

defineMeasures('Length', [
    ['Nanometers', 0.000000001],
    ['Millimeters', 0.001],
    ['Decimeters', 0.1],
    ['Meters', 1],
    ['Kilometers', 1000],
])
