import { Hex } from 'pkgs/honeycomb-grid'

import HexagonCircle from './_HexagonCircle'
import HexagonGrid from './_HexagonGrid'

export default class Hexagon {
    readonly effect: Effect

    grid!: HexagonGrid
    area?: HexagonCircle
    areaSides: Record<string, number[]> = {}
    readonly hex: Hex
    position = new Vector2()
    readonly size: number
    color: string = '#000000'

    q: number
    r: number
    s: number

    private constructor(deps: EffectDeps, hex: Hex) {
        this.effect = new Effect(deps, this)

        this.hex = hex
        this.size = hex.width

        this.q = hex.q
        this.r = hex.r
        this.s = hex.s
    }

    findEdges(area: string, hexagons: Hexagon[]): this {
        const grid: Hexagon[][] = []
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
