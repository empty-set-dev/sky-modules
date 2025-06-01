import __DrawPanel, { __DrawPanelBrushParameters } from './__DrawPanel'
import __HexagonsPanel from './__HexagonsPanel'

export interface __UIContainerParameters {
    gridEditor: HexagonGridEditor
    brushes: __DrawPanelBrushParameters[]
}
export default interface __UIContainer extends Enability {}
@enability
export default class UIContainer {
    readonly effect: Effect
    readonly gridEditor: HexagonGridEditor

    drawPanel: __DrawPanel
    hexagonsPanel: __HexagonsPanel

    constructor(deps: EffectDeps, parameters: __UIContainerParameters) {
        this.effect = new Effect(deps, this)
        Enability.super(this)

        this.gridEditor = parameters.gridEditor

        this.hexagonsPanel = new __HexagonsPanel(this.effect)

        this.drawPanel = new __DrawPanel(this.effect, {
            brushes: parameters.brushes,
        })
    }
}
