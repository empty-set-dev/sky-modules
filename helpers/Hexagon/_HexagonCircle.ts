import Hexagon from './__Hexagon'

export interface HexagonCircleParameters {
    radius: number
    q?: number
    r?: number
    s?: number
}
export default class HexagonCircle {
    hexagons: Hexagon[] = []
    center!: Hexagon
    radius!: number
    q?: number
    r?: number
    s?: number

    constructor(parameters: HexagonCircleParameters) {
        Object.assign(this, parameters)
    }
}
