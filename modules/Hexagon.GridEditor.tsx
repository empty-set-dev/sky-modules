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

            new WindowEventListener('wheel', (ev) => {
                ev.preventDefault()
                ev.stopPropagation()
                console.log(ev)
                return false
            }, this.effect)
        }

        clickHexagon(point: Vector2): this {
            const hex = this.grid.pointToHex({ x: point.x, y: point.y }, { allowOutside: false })

            if (!hex) {
                return this
            }

            const hexagon = hex.hexagon
            hexagon.color = '#ff5555'

            return this
        }

        Component() {
            return <>123</>
        }

        protected onGlobalMouseMove(ev: Sky.MouseMoveEvent): void {
            if (this.effect.root.isLeftMousePressed) {
                this.clickHexagon(new Vector2(ev.x, ev.y))
            }
        }

        protected onGlobalMouseDown(ev: Sky.MouseDownEvent): void {
            this.clickHexagon(new Vector2(ev.x, ev.y))
        }



        onGlobalKeyDown(ev: Sky.KeyboardDownEvent): void {
            if (ev.code === 'KeyS' && this.effect.root.isPressed.ControlLeft) {
                localStorage.setItem('grids', JSON.stringify(''))
            }
        }
    }
}

globalify.namespace('Hexagon', HexagonLib)
