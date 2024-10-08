import './_measures'
import globalify from 'sky/helpers/globalify'

declare global {
    const nanometers: number
    const millimeters: number
    const decimeters: number
    const meters: number
    const kilometers: number

    interface Length extends Number, LengthID {
        get nanometers(): number
        get millimeters(): number
        get decimeters(): number
        get meters(): number
        get kilometers(): number
    }
    function Length(value: Length | number, dimension?: number): Length
}

class LengthID {
    private LengthID!: void
}

globalify(
    measures('Length', [
        ['nanometers', 0.000000001],
        ['millimeters', 0.001],
        ['decimeters', 0.1],
        ['meters', 1],
        ['kilometers', 1000],
    ])
)
