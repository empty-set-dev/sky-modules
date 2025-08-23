import './_defineMeasures'

declare global {
    interface Number {
        get asNanograms(): number
        get inNanograms(): number
        get asMilligrams(): number
        get inMilligrams(): number
        get asDecigrams(): number
        get inDecigrams(): number
        get asGrams(): number
        get inGrams(): number
        get asKilograms(): number
        get inKilograms(): number
        get asTons(): number
        get inTons(): number
    }
}

defineMeasures('Weight', [
    ['Nanograms', 0.000000001],
    ['Milligrams', 0.001],
    ['Decigrams', 0.1],
    ['Grams', 1],
    ['Kilograms', 1000],
    ['Tons', 1000000],
])
