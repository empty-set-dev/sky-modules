import { Hex } from 'pkgs/honeycomb-grid'

import HexagonGrid from './_HexagonGrid'

export default class Hexagon {
    readonly effect: Effect

    grid!: HexagonGrid
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
}
