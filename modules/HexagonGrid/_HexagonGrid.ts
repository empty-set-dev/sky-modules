import * as HoneycombGrid from 'pkgs/honeycomb-grid'
import Enability from 'sky/effects/Enability'
import Vector2 from 'sky/math/Vector2'

import Hexagon from './_Hexagon'
import HexagonCircle from './_HexagonCircle'

export interface HexagonGridParameters<T = void> {
    hexagonSize: HoneycombGrid.HexOptions['dimensions']
    hexagonOffset?: HoneycombGrid.HexOptions['offset']
    hexagonOrigin?: HoneycombGrid.HexOptions['origin']
    w?: number
    h?: number
    circles?: HexagonCircle<T>[]
}
export default interface HexagonGrid extends Enability {}
@mixin(Enability)
export default class HexagonGrid<T = void> extends HoneycombGrid.Grid<HoneycombGrid.Hex> {
    readonly effect: Effect

    position = new Vector2()

    hexagons: Hexagon<T>[] = []

    constructor(deps: EffectDeps, parameters: HexagonGridParameters<T>) {
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

        this.effect = new Effect(deps, this)
        Enability.super(this)

        this.forEach(hex => this.__createHexagon(hex))

        if (parameters.circles != null) {
            parameters.circles.forEach(circle => this.addCircle(circle))
        }
    }

    getHexagon(coordinates: HoneycombGrid.HexCoordinates): undefined | Hexagon<T> {
        return this.getHex(coordinates)?.hexagon as never
    }

    getHexagonByPoint(point: Vector2): undefined | Hexagon<T> {
        return this.getHexagon(this.pointToHex(point))
    }

    getCircleCenter(circle: HexagonCircle<T>): [number, number] {
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

        return [q, r]
    }

    addCircle(circle: HexagonCircle<T>): this {
        const [q, r] = this.getCircleCenter(circle)

        const hexes: HoneycombGrid.Hex[] = []
        hexes.push(this.createHex({ q, r }))
        for (let i = 1; i < circle.radius; ++i) {
            for (let j = 0; j < i; ++j) {
                const hexesParameters = [
                    { q: q + i, r: r - j },
                    { q: q - j - 1, r: r + i },
                    { q: q + i - j - 1, r: r + j + 1 },
                    { q: q - j + i, r: r - i },
                    { q: q - i, r: r + i - j - 1 },
                    { q: q - j, r: r + j - i },
                ]

                hexesParameters.forEach(hexParameters => {
                    if (!this.getHex(hexParameters)) {
                        hexes.push(this.createHex(hexParameters))
                    }
                })
            }
        }

        this.setHexes(hexes)
        hexes.forEach(hex => this.__createHexagon(hex, circle))
        circle.hexagons ??= []
        circle.hexagons.push(...hexes.map(hex => hex.hexagon as never))

        circle.hexagons.forEach(hexagon => {
            hexagon.findEdges('circle', circle.hexagons)
        })

        return this
    }

    rotateCircle(circle: HexagonCircle<T>, count: number): this {
        const [centerQ, centerR] = this.getCircleCenter(circle)

        for (let i = 0; i < count; i++) {
            const data: T[][] = []

            circle.hexagons.forEach(hexagon => {
                const q = hexagon.q - centerQ
                const r = hexagon.r - centerR
                data[q] ??= []
                data[q][r] = hexagon.data as never
            })

            circle.hexagons.forEach(hexagon => {
                const q = hexagon.q - centerQ
                const r = hexagon.r - centerR
                hexagon.data = data[-r][q + r] as never
            })
        }

        circle.hexagons.forEach(hexagon => {
            hexagon.clearEdges('circle')
            hexagon.findEdges('circle', circle.hexagons)
        })

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

    private __createHexagon(hex: HoneycombGrid.Hex, area?: HexagonCircle<T>): void {
        if (hex.hexagon) {
            return
        }

        const hexagon = new (Hexagon<T> as {
            new (...args: unknown[]): Hexagon<T>
        })(this.effect, hex)

        this.hexagons.push(hexagon)
        hexagon.grid = this
        area != null && (hexagon.area = area)
        hexagon.position.x = hex.x
        hexagon.position.y = hex.y
        hex.hexagon = hexagon as never

        if (area) {
            if (area.center == null) {
                area.center = hexagon
            }
        }
    }
}
