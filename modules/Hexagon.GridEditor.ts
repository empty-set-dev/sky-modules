import globalify from 'sky/utilities/globalify'
import 'sky/features/effect/global'

declare global {
    namespace Hexagon {
        interface GridEditorParameters extends HexagonLib.GridEditorParameters {}
        class GridEditor extends HexagonLib.GridEditor {}
    }
}

namespace HexagonLib {
    export interface GridEditorParameters {
        grid: Hexagon.Grid
    }
    export class GridEditor {
        readonly effect: Effect
        readonly grid: Hexagon.Grid

        constructor(deps: EffectDeps, parameters: GridEditorParameters) {
            this.effect = new Effect(deps, this)
            this.grid = parameters.grid
        }

        clickHexagon(ev: Sky.MouseEvent): this {
            const hex = this.grid.pointToHex({ x: ev.x, y: ev.y }, { allowOutside: false })

            if (hex) {
                const hexagon = hex.hexagon

                hexagon.color = '#ff5555'
            }

            return this
        }

        protected onGlobalMouseMove(ev: Sky.MouseMoveEvent): void {
            if (this.effect.root.isLeftMousePressed) {
                this.clickHexagon(ev)
            }
        }

        protected onGlobalMouseDown(ev: Sky.MouseDownEvent): void {
            this.clickHexagon(ev)
        }
    }
}

globalify.namespace('Hexagon', HexagonLib)
