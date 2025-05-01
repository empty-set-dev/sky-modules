import { Hex } from 'pkgs/honeycomb-grid'

import HexagonCircle from './_HexagonCircle'
import HexagonGrid from './_HexagonGrid'

export default class Hexagon {
    readonly effect: Effect

    grid!: HexagonGrid
    area?: HexagonCircle
    isEdge: boolean = false
    isRightEdge: boolean = false
    isTopRightEdge: boolean = false
    isBottomRightEdge: boolean = false
    isLeftEdge: boolean = false
    isTopLeftEdge: boolean = false
    isBottomLeftEdge: boolean = false
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
