import './_defineMeasures'

declare global {
    interface Number {
        get asMetersPerSecond(): number
    }
    interface MetersPerSecond extends Number, MetersPerSecondID {
        get inMetersPerSecond(): number
    }
}

class MetersPerSecondID {
    private MetersPerSecondID = true
}

defineMeasures('MetersPerSecond', [['MetersPerSecond', 1]])
