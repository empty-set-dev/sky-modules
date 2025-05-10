import DrawPanel from './__DrawPanel'
import HexagonsPanel from './__HexagonsPanel'

export interface HexagonGridEditorUIContainerParameters {
    gridEditor: Hexagon.GridEditor
}
export default class HexagonGridEditorUIContainer {
    readonly effect: Effect
    readonly gridEditor: Hexagon.GridEditor

    drawPanel: DrawPanel
    hexagonsPanel: HexagonsPanel

    constructor(deps: EffectDeps, gridEditor: Hexagon.GridEditor) {
        this.effect = new Effect(deps, this)
        this.gridEditor = gridEditor

        this.hexagonsPanel = new HexagonsPanel(this.effect, {
            drawContext: this.gridEditor.canvas.drawContext,
        })

        this.drawPanel = new DrawPanel(this.effect, {
            drawContext: this.gridEditor.canvas.drawContext,
        })
    }
}
