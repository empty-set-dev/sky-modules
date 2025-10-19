import DrawPanel, { DrawPanelParameters } from './DrawPanel'
import HexagonsPanel from './HexagonsPanel'

export interface UIContainerParameters {
    gridEditor: HexagonGridEditor
    brushes: DrawPanelParameters['brushes']
}
export default interface UIContainer extends Enability {}
@enability
export default class UIContainer {
    readonly effect: Effect
    readonly gridEditor: HexagonGridEditor

    drawPanel: DrawPanel
    hexagonsPanel: HexagonsPanel

    constructor(dep: EffectDep, parameters: UIContainerParameters) {
        this.effect = new Effect(dep, this)
        Enability.super(this)

        this.gridEditor = parameters.gridEditor
        this.hexagonsPanel = new HexagonsPanel(this.effect)
        this.drawPanel = new DrawPanel(this.effect, {
            brushes: parameters.brushes,
        })
    }
}
