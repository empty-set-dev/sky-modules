import '../measures'
import globalify from 'helpers/globalify'

declare global {
    const nanometers: number
    const millimeters: number
    const decimeters: number
    const meters: number
    const kilometers: number

    interface Distance extends Number, DistanceTypeId {
        get nanometers(): number
        get millimeters(): number
        get decimeters(): number
        get meters(): number
        get kilometers(): number
    }
    function Distance(value: Distance | number, dimension?: number): Distance
}

class DistanceTypeId {
    private abstract: DistanceTypeId
}

globalify(
    measures('Distance', [
        ['nanometers', 0.000000001],
        ['millimeters', 1000000],
        ['decimeters', 100],
        ['meters', 10],
        ['kilometers', 1000],
    ])
)
