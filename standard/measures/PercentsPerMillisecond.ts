import './_defineMeasures'

declare global {
    interface Number {
        get asPercentsPerMillisecond(): number
    }
    interface PercentsPerMillisecond extends Number, PercentsPerMillisecondID {
        get inPercentsPerMillisecond(): number
    }
}

class PercentsPerMillisecondID {
    private PercentsPerMillisecondID = true
}

defineMeasures('PercentsPerMillisecond', [['PercentsPerMillisecond', 1]])
