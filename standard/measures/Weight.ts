import './_defineMeasures'

declare global {
    interface Number {
        get asNanograms(): Weight
        get asMilligrams(): Weight
        get asDecigrams(): Weight
        get asGrams(): Weight
        get asKilograms(): Weight
        get asTons(): Weight
    }
    interface Weight extends Number, WeightID {
        get inNanograms(): number
        get inMilligrams(): number
        get inDecigrams(): number
        get inGrams(): number
        get inKilograms(): number
        get inTons(): number
    }
}

class WeightID {
    private WeightID = true
}

defineMeasures('Weight', [
    ['Nanograms', 0.000000001],
    ['Milligrams', 0.001],
    ['Decigrams', 0.1],
    ['Grams', 1],
    ['Kilograms', 1000],
    ['Tons', 1000000],
])
