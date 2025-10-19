import './defineMeasures'

declare global {
    interface Number {
        get asMetersPerSecond(): MetersPerSecond
    }
    interface MetersPerSecond extends Number, MetersPerSecondID {
        get inMetersPerSecond(): number
    }
}

class MetersPerSecondID {
    private MetersPerSecondID = true
}

defineMeasures('MetersPerSecond', [['MetersPerSecond', 1]])
