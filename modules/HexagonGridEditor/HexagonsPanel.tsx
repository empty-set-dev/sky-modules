// import styles from './HexagonsPanel.module.scss'

// export default interface HexagonsPanel extends Enability {}
// @enability
// export default class HexagonsPanel {
//     readonly effect: Effect
//     position: Vector2 = new Vector2(0, 10 + 34)

//     constructor(dep: EffectDep) {
//         this.effect = new Effect(dep, this)
//         Enability.super(this)
//     }

//     @bind
//     getComponent(editor: HexagonGridEditor): ReactNode {
//         return <HexagonsPanelComponent self={this} editor={editor} />
//     }
// }

// const cx = cn('[HexagonGridEditor-HexagonsPanel]', styles)
// interface HexagonsPanelComponentProps {
//     self: HexagonsPanel
//     editor: HexagonGridEditor
// }
// function HexagonsPanelComponent({ self, editor }: HexagonsPanelComponentProps): ReactNode {
//     const b = `HexagonGridEditor-HexagonsPanel`

//     const zones = Object.keys(editor.zones)
//         .sort((a, b) => parseInt(a) - parseInt(b))
//         .map(name => ({
//             name,
//             image: editor.zones[name].image,
//             grid: editor.zones[name].grid,
//         }))

//     return (
//         <div className="HexagonGridEditor-HexagonsPanel" {...captureUI(self.effect)}>
//             {zones.map(zone => (
//                 <div
//                     className={cx`${b}-zone`}
//                     key={zone.name}
//                     onClick={() => {
//                         editor.zoneName = zone.name
//                         editor.gridContainer.grid = zone.grid
//                     }}
//                 >
//                     <div className={cx`${b}-zone-name`}>{zone.name}</div>
//                     <img className={cx`${b}-zone-image`} src={zone.image} />
//                 </div>
//             ))}
//         </div>
//     )
// }
