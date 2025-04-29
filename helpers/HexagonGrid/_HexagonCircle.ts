import Hexagon from './_Hexagon'

export interface HexagonCircleParameters {
    radius: number
    q?: number
    r?: number
    s?: number
}
class HexagonCircle {
    hexagons: Hexagon[] = []
    center!: Hexagon
    radius!: number
    q?: number
    r?: number
    s?: number

    constructor(parameters: HexagonCircleParameters) {
        Object.assign(this, parameters)
    }

    neighborCoordinates(side: HexagonCircle.Side) {
        if (side === HexagonCircle.Side.SIDE_1) {
            return { q: 1, r: -1 }
        } else if (side === HexagonCircle.Side.SIDE_2) {
            return { q: 1, r: 0 }
        } else if (side === HexagonCircle.Side.SIDE_3) {
            return { q: 0, r: 1 }
        } else if (side === HexagonCircle.Side.SIDE_4) {
            return { q: -1, r: 1 }
        } else if (side === HexagonCircle.Side.SIDE_5) {
            return { q: -1, r: 0 }
        } else if (side === HexagonCircle.Side.SIDE_6) {
            return { q: 0, r: -1 }
        }

        return {
            q: 0,
            r: 0,
        }
    }
}
namespace HexagonCircle {
    export enum Side {
        SIDE_1 = 1,
        SIDE_2 = 2,
        SIDE_3 = 3,
        SIDE_4 = 4,
        SIDE_5 = 5,
        SIDE_6 = 6,
    }
}

export default HexagonCircle
