// import WasdController2D from '@sky-modules/effects/controllers/WasdController2D'

// import { __DrawPanelParameters } from './__DrawPanel'
// import { __HexagonData } from './__HexagonData'

// export interface __GridContainerParameters {
//     gridEditor: HexagonGridEditor
//     brushes: __DrawPanelParameters['brushes']
// }
// export default interface __GridContainer extends Enability {}
// @enability
// export default class __GridContainer extends Canvas.Sprite {
//     readonly gridEditor: HexagonGridEditor
//     grid: HexagonGrid<__HexagonData>
//     camera: Vector2 = new Vector2(-105, 0)
//     wasdController2D: WasdController2D

//     colors: Record<string, string> = {}
//     borders: Record<string, string> = {}
//     icons: Record<
//         string,
//         {
//             icon: string
//             color: string
//             positionColor?: string
//         }
//     > = {}

//     constructor(dep: EffectDep, parameters: __GridContainerParameters) {
//         super(dep)
//         Enability.super(this)

//         this.gridEditor = parameters.gridEditor

//         this.grid = new HexagonGrid<__HexagonData>(this.effect, {
//             hexagonSize: 50,
//             hexagonOrigin: { x: 0, y: 0 },
//             circles: [
//                 new HexagonCircle({
//                     q: 0,
//                     r: 0,
//                     radius: 4,
//                 }),
//             ],
//         })

//         this.wasdController2D = new WasdController2D(this.effect)

//         parameters.brushes.color?.forEach(brush => (this.colors[brush.value!] = brush.color!))
//         parameters.brushes.border?.forEach(brush => (this.borders[brush.value!] = brush.color!))
//         parameters.brushes.icon?.forEach(
//             brush =>
//                 (this.icons[brush.value!] = {
//                     icon: brush.icon!,
//                     color: brush.color!,
//                     positionColor: brush.positionColor,
//                 })
//         )
//     }

//     clickHexagon(point: Vector2): this {
//         if (!this.gridEditor.uiContainer.drawPanel.brush) {
//             return this
//         }

//         const hex = this.gridEditor.gridContainer.grid.pointToHex(
//             { x: point.x, y: point.y },
//             { allowOutside: false }
//         )

//         if (!hex) {
//             return this
//         }

//         const hexagon: Hexagon<__HexagonData> = hex.hexagon as never

//         if (this.gridEditor.uiContainer.drawPanel.brush.type === 'color') {
//             hexagon.data.color = this.gridEditor.uiContainer.drawPanel.brush.value
//         }
//         if (this.gridEditor.uiContainer.drawPanel.brush.type === 'border') {
//             hexagon.data.borderColor = this.gridEditor.uiContainer.drawPanel.brush.value
//         }
//         if (this.gridEditor.uiContainer.drawPanel.brush.type === 'position') {
//             hexagon.data.position = this.gridEditor.uiContainer.drawPanel.brush.position
//         }
//         if (this.gridEditor.uiContainer.drawPanel.brush.type === 'icon') {
//             hexagon.data.icon = this.gridEditor.uiContainer.drawPanel.brush.value
//         }

//         return this
//     }

//     protected onGlobalMouseDown(ev: Sky.MouseDownEvent): void {
//         if (ev.isCaptured) {
//             return
//         }

//         this.clickHexagon(new Vector2(ev.x, ev.y))
//     }

//     protected onGlobalMouseMove(ev: Sky.MouseMoveEvent): void {
//         if (ev.isCaptured) {
//             return
//         }

//         if (this.effect.root.isLeftMousePressed) {
//             this.clickHexagon(new Vector2(ev.x, ev.y))
//         }
//     }

//     protected update(ev: Sky.UpdateEvent): void {
//         const cameraAcceleration = this.wasdController2D.acceleration
//             .clone()
//             .multiplyScalar(ev.dt * 1000)

//         this.camera.x += cameraAcceleration.x
//         this.camera.y -= cameraAcceleration.y

//         this.position.x = window.innerWidth / 2 - this.camera.x
//         this.position.y = window.innerHeight / 2 - this.camera.y
//     }

//     protected draw(ev: Sky.DrawEvent): void {
//         const canvas = this.effect.context(Canvas)

//         this.gridEditor.canvas.drawContext.clearRect(
//             0,
//             0,
//             this.gridEditor.canvas.domElement.width,
//             this.gridEditor.canvas.domElement.height
//         )

//         this.drawGrid(canvas, this.grid.hexagons, ev)
//     }

//     drawGrid(canvas: Canvas, hexagons: Hexagon<__HexagonData>[], ev: Sky.DrawEvent): void {
//         hexagons.forEach(hexagon => {
//             const point = {
//                 x: ev.x + hexagon.position.x,
//                 y: ev.y + hexagon.position.y,
//             }

//             canvas.drawHexagon({
//                 x: point.x,
//                 y: point.y,
//                 radius: hexagon.size / 2,
//                 color: this.colors[hexagon.data.color!],
//                 strokeColor: '#666666',
//                 strokeWidth: 2,
//             })
//         })

//         hexagons.forEach(hexagon => {
//             const point = {
//                 x: ev.x + hexagon.position.x,
//                 y: ev.y + hexagon.position.y,
//             }

//             if (hexagon.data.borderColor) {
//                 canvas.drawHexagon({
//                     x: point.x,
//                     y: point.y,
//                     radius: hexagon.size / 2 - 10,
//                     strokeColor: this.borders[hexagon.data.borderColor],
//                     strokeWidth: 3,
//                 })
//             }

//             if (hexagon.data.icon) {
//                 canvas.drawImage({
//                     image: this.icons[hexagon.data.icon]?.icon,
//                     x: point.x - 24,
//                     y: point.y - 24,
//                     w: 48,
//                     h: 48,
//                     color: this.icons[hexagon.data.icon]?.color ?? '0x000000',
//                 })
//             }

//             if (hexagon.data.position) {
//                 let color = '#000000'

//                 if (hexagon.data.icon && this.icons[hexagon.data.icon].positionColor) {
//                     color = this.icons[hexagon.data.icon].positionColor!
//                 }

//                 canvas.drawText({
//                     text: hexagon.data.position.toString(),
//                     font: '48px Raleway',
//                     x: point.x,
//                     y: point.y,
//                     color,
//                 })
//             }
//         })

//         hexagons.forEach(hexagon => {
//             const point = {
//                 x: ev.x + hexagon.position.x,
//                 y: ev.y + hexagon.position.y,
//             }

//             if (hexagon.areaSides.circle.length > 0) {
//                 canvas.drawHexagon({
//                     x: point.x,
//                     y: point.y,
//                     radius: hexagon.size / 2,
//                     sides: hexagon.areaSides.circle,
//                     strokeColor: '#666666',
//                     strokeWidth: 4,
//                 })
//             }
//         })
//     }
// }
