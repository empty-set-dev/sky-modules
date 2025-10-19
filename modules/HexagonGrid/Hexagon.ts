import { Hex } from 'pkgs/honeycomb-grid'

import HexagonCircle from './HexagonCircle'
import HexagonGrid from './HexagonGrid'

export default class Hexagon<T = void> {
    readonly effect: Effect

    grid!: HexagonGrid<T>
    area?: HexagonCircle<T>
    areaSides: Record<string, number[]> = {}
    readonly hex: Hex
    position = new Vector2()
    readonly size: number
    data: T = {} as never

    q: number
    r: number
    s: number

    private constructor(dep: EffectDep, hex: Hex) {
        this.effect = new Effect(dep, this)

        this.hex = hex
        this.size = hex.width

        this.q = hex.q
        this.r = hex.r
        this.s = hex.s
    }
    getNeighbors(): Hexagon<T>[] {
        const neighbors: Hexagon<T>[] = []
        const coordinates = this.getNeighborsCoordinates()

        coordinates.forEach(coordinates => {
            const neighbor = this.grid.getHexagon({
                q: this.q + coordinates.q,
                r: this.r + coordinates.r,
            })

            if (neighbor) {
                neighbors.push(neighbor)
            }
        })

        return neighbors
    }

    getNeighborsCoordinates(): { q: number; r: number }[] {
        return [
            {
                q: 1,
                r: 0,
            },
            {
                q: -1,
                r: 0,
            },
            {
                q: 0,
                r: 1,
            },
            {
                q: 0,
                r: -1,
            },
            {
                q: 1,
                r: -1,
            },
            {
                q: -1,
                r: 1,
            },
        ]
    }

    findEdges(area: string, hexagons: Hexagon<T>[]): this {
        const grid: Hexagon<T>[][] = []
        hexagons.forEach(hexagon => {
            grid[hexagon.q] ??= []
            grid[hexagon.q][hexagon.r] = hexagon
        })

        this.areaSides[area] = []

        if (grid[this.q - 1] == null || grid[this.q - 1][this.r] == null) {
            this.areaSides[area].push(4)
        }
        if (grid[this.q + 1] == null || grid[this.q + 1][this.r] == null) {
            this.areaSides[area].push(1)
        }
        if (grid[this.q] == null || grid[this.q][this.r - 1] == null) {
            this.areaSides[area].push(5)
        }
        if (grid[this.q] == null || grid[this.q][this.r + 1] == null) {
            this.areaSides[area].push(2)
        }
        if (grid[this.q - 1] == null || grid[this.q - 1][this.r + 1] == null) {
            this.areaSides[area].push(3)
        }
        if (grid[this.q + 1] == null || grid[this.q + 1][this.r - 1] == null) {
            this.areaSides[area].push(0)
        }

        return this
    }

    clearEdges(area: string): this {
        this.areaSides[area] = []

        return this
    }
}
