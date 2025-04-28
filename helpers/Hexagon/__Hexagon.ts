import { Hex } from 'pkgs/honeycomb-grid'

import App from '#/App'
import drawHexagon from '#/utilities/drawHexagon'

import HexagonGrid from './_HexagonGrid'

export default class Hexagon {
    readonly effect: Effect

    grid!: HexagonGrid
    readonly hex: Hex
    position = new Vector2()
    readonly size: number
    color: string = '#2b2b2b'

    q: number
    r: number
    s: number

    constructor(deps: EffectDeps, hex: Hex) {
        this.effect = new Effect(deps, this)

        this.hex = hex
        this.size = hex.width

        this.q = hex.q
        this.r = hex.r
        this.s = hex.s
    }

    draw(event: Sky.DrawEvent): void {
        const { ctx } = this.effect.context(App)

        const point = {
            x: event.position.x + this.position.x,
            y: event.position.y + this.position.y,
        }

        drawHexagon(ctx, {
            x: point.x,
            y: point.y,
            radius: this.size / 2,
            color: this.color,
            strokeColor: '#ffffff',
            strokeWidth: 1,
        })
    }
}
