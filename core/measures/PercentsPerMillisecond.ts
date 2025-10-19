import './defineMeasures'

declare global {
    interface Number {
        get asPercentsPerMillisecond(): PercentsPerMillisecond
    }
    interface PercentsPerMillisecond extends Number, PercentsPerMillisecondID {
        get inPercentsPerMillisecond(): number
    }
}

class PercentsPerMillisecondID {
    private PercentsPerMillisecondID = true
}

defineMeasures('PercentsPerMillisecond', [['PercentsPerMillisecond', 1]])
