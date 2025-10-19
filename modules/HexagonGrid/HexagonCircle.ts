import Hexagon from './Hexagon'

export interface HexagonCircleParameters {
    radius: number
    q?: number
    r?: number
    s?: number
}
class HexagonCircle<T = void> {
    hexagons: Hexagon<T>[] = []
    center!: Hexagon<T>
    radius!: number
    q?: number
    r?: number
    s?: number

    constructor(parameters: HexagonCircleParameters) {
        Object.assign(this, parameters)
    }

    neighborCoordinates(side: number): { q: number; r: number } {
        if (side === 0) {
            return { q: (this.q ?? 0) + 1, r: (this.r ?? 0) - 1 }
        } else if (side === 1) {
            return { q: (this.q ?? 0) + 1, r: this.r ?? 0 }
        } else if (side === 2) {
            return { q: this.q ?? 0, r: (this.r ?? 0) + 1 }
        } else if (side === 3) {
            return { q: (this.q ?? 0) - 1, r: (this.r ?? 0) + 1 }
        } else if (side === 4) {
            return { q: (this.q ?? 0) - 1, r: this.r ?? 0 }
        } else if (side === 5) {
            return { q: 0, r: -1 }
        }

        return undefined as never
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
