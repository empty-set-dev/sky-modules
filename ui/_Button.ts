import './_UI'
import { TextView } from 'pkgs/troika-three-text'
import Sprite from 'sky/views/Sprite'
import 'sky/Canvas/global'

declare global {
    namespace UI {
        type ButtonParams = lib.ButtonParams

        type Button = lib.Button
        const Button: typeof lib.Button
    }
}

namespace lib {
    export interface ButtonParams {
        texture?: Three.Texture
        text: string
        x: number
        y: number
        w?: number
        h?: number
        click: () => void
    }
    export class Button extends Sprite {
        w!: number
        h!: number
        textView: TextView
        click: () => void
        promise: Promise<Button>

        static makeTexture(params: UI.TextureParams): Three.Texture {
            const ctx = document.createElement('canvas').getContext('2d')!
            ctx.canvas.width = params.w + params.strokeWidth * 2
            ctx.canvas.height = params.h + params.strokeWidth * 2
            Canvas.drawRoundedRect(ctx, {
                x: 0,
                y: 0,
                w: params.w,
                h: params.h,
                radius: params.radius,
                color: new Three.Color(params.color).getStyle(),
                opacity: params.opacity,
                strokeColor: new Three.Color(params.color).getStyle(),
                strokeWidth: params.strokeWidth,
            })
            const texture = new Three.CanvasTexture(ctx.canvas)
            ctx.canvas.remove()
            return texture
        }

        static makeText(params: UI.TextParams): TextView {
            const textView = new TextView()
            textView.text = params.text
            textView.color = params.color
            textView.fontSize = params.fontSize
            textView.fontWeight = params.fontWeight
            textView.anchorX = 'center'
            textView.anchorY = 'middle'
            textView.outlineBlur = 0
            textView.outlineColor = params.strokeColor
            textView.outlineWidth = params.strokeWidth
            return textView
        }

        constructor(deps: EffectDeps, params: ButtonParams) {
            super(deps)

            this.view.position.x = params.x
            this.view.position.y = params.y

            this.textView = Button.makeText({
                text: params.text,
                color: 0xffffff,
                fontSize: 20,
                fontWeight: 'bold',
                opacity: 1,
                strokeColor: 0x333333,
                strokeWidth: 0.5,
            })
            this.textView.renderOrder = 1

            this.click = params.click

            this.promise = until(async (): Promise<Button> => {
                await new Promise<void>(resolve => {
                    this.textView.sync(resolve)
                })

                this.w = params.w ?? this.textView.geometry.boundingBox?.max.x! * 2 + 64
                this.h = params.h ?? this.textView.geometry.boundingBox?.max.y! * 2 + 4

                this.textView!.position.x = this.w / 2
                this.textView!.position.y = this.h / 2

                this.__texture = Button.makeTexture({
                    w: this.w,
                    h: this.h,
                    radius: 16,
                    color: 0x555555,
                    opacity: 0.5,
                    strokeColor: 0x2f2f2f,
                    strokeWidth: 0,
                })

                this.__hoverTexture = Button.makeTexture({
                    w: this.w,
                    h: this.h,
                    radius: 16,
                    color: 0x777777,
                    opacity: 0.5,
                    strokeColor: 0x2f2f2f,
                    strokeWidth: 0,
                })

                this.__pressTexture = Button.makeTexture({
                    w: this.w,
                    h: this.h,
                    radius: 16,
                    color: 0x444444,
                    opacity: 0.5,
                    strokeColor: 0x2f2f2f,
                    strokeWidth: 0,
                })

                const geometry = new Three.PlaneGeometry(this.w, this.h, 1, 1)
                const material = (this.__material = new Three.MeshBasicMaterial({
                    map: (params && params.texture) ?? this.__texture,
                    transparent: true,
                }))
                const plane = (this.__plane = new Three.Mesh(geometry, material))
                plane.renderOrder = 0
                plane.position.x = this.w / 2
                plane.position.y = this.h / 2

                this.view.add(plane)
                this.view.add(this.textView)

                this.__updateState()

                return this
            })
        }

        globalMouseMove(ev: MouseDownEvent): void {
            this.__hovered = this.__checkPoint(new Vector2(ev.x, ev.y))

            this.__updateState()
        }

        globalMouseDown(): void {
            if (this.__hovered) {
                this.__waitClick = true
            }

            this.__updateState()
        }

        globalMouseUp(): void {
            if (this.__hovered && this.__waitClick) {
                this.click()
            }

            this.__waitClick = false

            this.__updateState()
        }

        __updateState(): void {
            if (!this.__material) {
                return
            }

            if (this.__hovered) {
                this.__material.map = this.__hoverTexture

                if (this.__waitClick) {
                    this.__material.map = this.__pressTexture
                }
            } else {
                this.__material.map = this.__texture
                this.__plane.material = this.__material
            }
        }

        __checkPoint(point: Vector2): boolean {
            if (point.x >= 0 && point.x <= this.w) {
                if (point.y >= 0 && point.y <= this.h) {
                    return true
                }
            }

            return false
        }

        __plane!: Three.Mesh
        __material!: Three.MeshBasicMaterial
        __hovered: boolean = false
        __waitClick: boolean = false

        __texture!: Three.Texture
        __hoverTexture!: Three.Texture
        __pressTexture!: Three.Texture
    }
}

Object.assign(UI, lib)
