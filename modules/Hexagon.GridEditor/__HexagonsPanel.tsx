export interface HexagonsPanelParameters {
    drawContext: CanvasRenderingContext2D
}
export default interface HexagonsPanel extends Enability {}
@enability
export default class HexagonsPanel {
    readonly effect: Effect
    readonly drawContext: CanvasRenderingContext2D
    position: Vector2 = new Vector2(0, 10 + 34)

    constructor(deps: EffectDeps, parameters: HexagonsPanelParameters) {
        this.effect = new Effect(deps, this)
        Enability.super(this)
        this.drawContext = parameters.drawContext
    }

    @bind
    getComponent(editor: Hexagon.GridEditor): ReactNode {
        const b = `HexagonsPanel`

        const zones = Object.keys(editor.zones)
            .sort((a, b) => a.localeCompare(b))
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
                            editor.grid = zone.grid
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
