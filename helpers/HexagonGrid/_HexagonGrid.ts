import * as HoneycombGrid from 'pkgs/honeycomb-grid'
import Vector2 from 'sky/math/Vector2'

import Hexagon from './_Hexagon'
import HexagonCircle from './_HexagonCircle'

export interface HexagonGridParameters {
    hexagonSize: HoneycombGrid.HexOptions['dimensions']
    hexagonOffset?: HoneycombGrid.HexOptions['offset']
    hexagonOrigin?: HoneycombGrid.HexOptions['origin']
    w?: number
    h?: number
    circles?: HexagonCircle[]
}
export default class HexagonGrid extends HoneycombGrid.Grid<HoneycombGrid.Hex> {
    readonly effect: Effect

    position = new Vector2()

    hexagons: Hexagon[] = []

    constructor(deps: EffectDeps, parameters: HexagonGridParameters) {
        const hexagonParameters: Partial<HoneycombGrid.HexOptions> = {
            dimensions: parameters.hexagonSize,
            orientation: HoneycombGrid.Orientation.FLAT,
        }

        if (parameters.hexagonOffset) {
            hexagonParameters.offset = parameters.hexagonOffset
        }
        if (parameters.hexagonOrigin) {
            hexagonParameters.origin = parameters.hexagonOrigin
        }

        const HoneycombGridHexagon = HoneycombGrid.defineHex(hexagonParameters)

        super(
            HoneycombGridHexagon,
            HoneycombGrid.rectangle({
                width: parameters.w ?? 0,
                height: parameters.h ?? 0,
            }) as never
        )

        this.forEach(hex => this.__createHexagon(hex))

        this.effect = new Effect(deps, this)

        if (parameters.circles != null) {
            parameters.circles.forEach(circle => this.addCircle(circle))
        }
    }

    getHexagon(coordinates: HoneycombGrid.HexCoordinates): undefined | Hexagon {
        return this.getHex(coordinates)?.hexagon
    }

    addCircle(circle: HexagonCircle): this {
        let q = 0
        let r = 0

        if (circle.q) {
            q += (circle.q ?? 0) * (circle.radius - 1)
            r += (circle.q ?? 0) * circle.radius
        }

        if (circle.r) {
            q -= (circle.r ?? 0) * circle.radius
            r += (circle.r ?? 0) * (circle.radius + 3)
        }

        const hexes: HoneycombGrid.Hex[] = []
        hexes.push(this.createHex({ q, r }))
        for (let i = 1; i < circle.radius; ++i) {
            for (let j = 0; j < i; ++j) {
                hexes.push(
                    this.createHex({ q: q + i, r: r - j }),
                    this.createHex({ q: q - j - 1, r: r + i }),
                    this.createHex({ q: q + i - j - 1, r: r + j + 1 }),
                    this.createHex({ q: q - j + i, r: r - i }),
                    this.createHex({ q: q - i, r: r + i - j - 1 }),
                    this.createHex({ q: q - j, r: r + j - i })
                )
            }
        }
        this.setHexes(hexes)

        hexes.forEach(hex => this.__createHexagon(hex, circle))
        circle.hexagons ??= []
        circle.hexagons.push(...hexes.map(hex => hex.hexagon))

        return this
    }

    rotateCircle(circle: HexagonCircle, count: number): this {
        for (let i = 0; i < count; i++) {
            const colors: string[][] = []

            circle.hexagons.forEach(hexagon => {
                const q = hexagon.q
                const r = hexagon.r
                colors[q] ??= []
                colors[q][r] = hexagon.color
            })

            circle.hexagons.forEach(hexagon => {
                const q = hexagon.q
                const r = hexagon.r
                hexagon.color = colors[-r][q + r]
            })
        }

        return this
    }

    neighborsOf(coordinates: HoneycombGrid.HexCoordinates): Hexagon[] {
        const result: Hexagon[] = []
        let hexagon = this.neighborOf(coordinates, 0, { allowOutside: false })?.hexagon
        hexagon && result.push(hexagon)
        hexagon = this.neighborOf(coordinates, 1, { allowOutside: false })?.hexagon
        hexagon && result.push(hexagon)
        hexagon = this.neighborOf(coordinates, 2, { allowOutside: false })?.hexagon
        hexagon && result.push(hexagon)
        hexagon = this.neighborOf(coordinates, 4, { allowOutside: false })?.hexagon
        hexagon && result.push(hexagon)
        hexagon = this.neighborOf(coordinates, 6, { allowOutside: false })?.hexagon
        hexagon && result.push(hexagon)
        hexagon = this.neighborOf(coordinates, 7, { allowOutside: false })?.hexagon
        hexagon && result.push(hexagon)
        return result
    }

    @action_hook
    protected draw(ev: Sky.DrawEvent, next: Function): void {
        ev.position = ev.position.add(this.position)

        next()
    }

    private __createHexagon(hex: HoneycombGrid.Hex, area?: HexagonCircle): void {
        if (hex.hexagon) {
            return
        }

        const hexagon = new (Hexagon as {
            new (...args: unknown[]): Hexagon
        })(this.effect, hex)
        this.hexagons.push(hexagon)
        hexagon.grid = this
        hexagon.area = area
        hexagon.position.x = hex.x
        hexagon.position.y = hex.y
        hex.hexagon = hexagon

        if (area) {
            if (area.center == null) {
                area.center = hexagon
            }

            if (Math.abs(hexagon.q - area.center.q) === area.radius - 1) {
                hexagon.isEdge = true

                if (hexagon.q > area.center.q) {
                    hexagon.isRightEdge = true
                } else {
                    hexagon.isLeftEdge = true
                }
            }

            if (Math.abs(hexagon.r - area.center.r) === area.radius - 1) {
                hexagon.isEdge = true

                if (hexagon.r > area.center.r) {
                    hexagon.isBottomLeftEdge = true
                } else {
                    hexagon.isTopRightEdge = true
                }
            }

            if (Math.abs(hexagon.s - area.center.s) === area.radius - 1) {
                hexagon.isEdge = true

                if (hexagon.s > area.center.s) {
                    hexagon.isTopLeftEdge = true
                } else {
                    hexagon.isBottomRightEdge = true
                }
            }
        }
    }
}
