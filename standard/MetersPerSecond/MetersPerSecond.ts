import '../measures'
import globalify from 'helpers/globalify'

declare global {
    interface MetersPerSecond extends Number {}
    function MetersPerSecond(value: number): MetersPerSecond
}

globalify(measures('MetersPerSecond', []))
