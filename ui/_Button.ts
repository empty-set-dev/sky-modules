import './_UI'
import { TextView } from 'pkgs/troika-three-text'
import Sprite from 'sky/views/Sprite'
import { Texture } from 'three'

declare global {
    namespace UI {
        type ButtonParams = lib.ButtonParams

        type Button = lib.Button
        const Button: typeof lib.Button
    }
}

namespace lib {
    const texture = ((): Three.CanvasTexture => {
        const ctx = document.createElement('canvas').getContext('2d')!
        ctx.canvas.width = 256
        ctx.canvas.height = 256
        ctx.fillStyle = '#FFF'
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
        const texture = new Three.CanvasTexture(ctx.canvas)
        ctx.canvas.remove()
        return texture
    })()
    const hoverTexture = ((): Three.CanvasTexture => {
        const ctx = document.createElement('canvas').getContext('2d')!
        ctx.canvas.width = 256
        ctx.canvas.height = 256
        ctx.fillStyle = '#0FF'
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
        const texture = new Three.CanvasTexture(ctx.canvas)
        ctx.canvas.remove()
        return texture
    })()
    const pressTexture = ((): Three.CanvasTexture => {
        const ctx = document.createElement('canvas').getContext('2d')!
        ctx.canvas.width = 256
        ctx.canvas.height = 256
        ctx.fillStyle = '#FF0'
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
        const texture = new Three.CanvasTexture(ctx.canvas)
        ctx.canvas.remove()
        return texture
    })()

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

        constructor(deps: EffectDeps, params: ButtonParams) {
            super(deps)

            this.textView = new TextView()
            this.textView.text = params.text
            this.textView.color = 0xff0000
            this.textView.fontSize = 20
            this.textView.anchorX = 'center'
            this.textView.anchorY = 'middle'
            this.textView.fontWeight = 'bold'
            this.textView.outlineBlur = 0
            this.textView.outlineWidth = 4

            this.click = params.click

            this.promise = (async (): Promise<Button> => {
                await new Promise<void>(resolve => {
                    this.textView.sync(resolve)
                })

                this.view.position.x = params.x
                this.view.position.y = params.y
                this.w = params.w ?? 128
                this.h = params.h ?? 32

                this.textView!.position.x = this.w / 2
                this.textView!.position.y = this.h / 2

                const geometry = new Three.PlaneGeometry(this.w, this.h, 1, 1)
                const material = (this.__material = new Three.MeshBasicMaterial({
                    map: (params && params.texture) ?? texture,
                }))
                const plane = (this.__plane = new Three.Mesh(geometry, material))
                plane.position.x = this.w / 2
                plane.position.y = this.h / 2
                this.view.add(plane)

                return this
            })()
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
            if (this.__hovered) {
                this.__material.map = hoverTexture

                if (this.__waitClick) {
                    this.__material.map = pressTexture
                }
            } else {
                this.__material.map = texture
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

        __plane: Three.Mesh
        __material: Three.MeshBasicMaterial
        __hovered: boolean = false
        __waitClick: boolean = false
    }
}

Object.assign(UI, lib)
