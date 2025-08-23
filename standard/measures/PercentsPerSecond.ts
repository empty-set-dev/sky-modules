import './_defineMeasures'

declare global {
    interface Number {
        get asPercentsPerSecond(): number
    }
    interface PercentsPerSecond extends Number, PercentsPerSecondID {
        get inPercentsPerSecond(): number
    }
}

class PercentsPerSecondID {
    private PercentsPerSecondID = true
}

defineMeasures('PercentsPerSecond', [['PercentsPerSecond', 1]])
