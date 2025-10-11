import __DrawPanel, { __DrawPanelParameters } from './__DrawPanel'
import __HexagonsPanel from './__HexagonsPanel'

export interface __UIContainerParameters {
    gridEditor: HexagonGridEditor
    brushes: __DrawPanelParameters['brushes']
}
export default interface __UIContainer extends Enability {}
@enability
export default class UIContainer {
    readonly effect: Effect
    readonly gridEditor: HexagonGridEditor

    drawPanel: __DrawPanel
    hexagonsPanel: __HexagonsPanel

    constructor(dep: EffectDep, parameters: __UIContainerParameters) {
        this.effect = new Effect(dep, this)
        Enability.super(this)

        this.gridEditor = parameters.gridEditor
        this.hexagonsPanel = new __HexagonsPanel(this.effect)
        this.drawPanel = new __DrawPanel(this.effect, {
            brushes: parameters.brushes,
        })
    }
}
