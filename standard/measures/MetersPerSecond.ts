import './_measures'
import globalify from 'sky/utilities/globalify'

declare global {
    interface MetersPerSecond extends Number, MetersPerSecondID {}
    function MetersPerSecond(value: number): MetersPerSecond
}

class MetersPerSecondID {
    private MetersPerSecondID!: void
}

globalify(measures('MetersPerSecond', []))
