import './__HexagonsPanel.scss'

export interface __HexagonsPanelParameters {
    drawContext: CanvasRenderingContext2D
}
export default interface __HexagonsPanel extends Enability {}
@enability
export default class __HexagonsPanel {
    readonly effect: Effect
    readonly drawContext: CanvasRenderingContext2D
    position: Vector2 = new Vector2(0, 10 + 34)

    constructor(deps: EffectDeps, parameters: __HexagonsPanelParameters) {
        this.effect = new Effect(deps, this)
        Enability.super(this)

        this.drawContext = parameters.drawContext
    }

    @bind
    getComponent(editor: HexagonGridEditor): ReactNode {
        const b = `HexagonsPanel`

        const zones = Object.keys(editor.zones)
            .sort((a, b) => parseInt(a) - parseInt(b))
            .map(name => ({
                name,
                image: editor.zones[name].image,
                grid: editor.zones[name].grid,
            }))

        return (
            <div className="HexagonsPanel">
                {zones.map(zone => (
                    <div
                        key={zone.name}
                        onClick={() => {
                            editor.zoneName = zone.name
                            editor.gridContainer.grid = zone.grid
                        }}
                    >
                        <div className={`${b}-zone-name`}>{zone.name}</div>
                        <img className={`${b}-zone-image`} src={zone.image} />
                    </div>
                ))}
            </div>
        )
    }
}
