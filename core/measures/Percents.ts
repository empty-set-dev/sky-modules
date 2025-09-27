import './_defineMeasures'

declare global {
    interface Number {
        get asPercents(): Percents
    }
    interface Percents extends Number, PercentsID {
        get inPercents(): number
    }
}

class PercentsID {
    private PercentsID = true
}

defineMeasures('Percents', [['Percents', 1]])
