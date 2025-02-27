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
        w: number
        h: number
        textView: TextView
        click: () => void

        constructor(deps: EffectDeps, params: ButtonParams) {
            super(deps)

            this.view.position.x = params.x
            this.view.position.y = params.y
            this.w = params.w ?? 128
            this.h = params.h ?? 32

            const geometry = new Three.PlaneGeometry(this.w, this.h, 1, 1)
            const material = (this.__material = new Three.MeshBasicMaterial({
                map: (params && params.texture) ?? texture,
            }))
            const plane = (this.__plane = new Three.Mesh(geometry, material))
            plane.position.x = this.w / 2
            plane.position.y = this.h / 2
            this.view.add(plane)

            this.textView = new TextView()
            this.textView.text = params.text
            this.textView.color = 0x0f0
            this.textView.fontSize = 100000000
            this.view.add(this.textView)

            this.click = params.click
        }

        globalMouseMove(ev: MouseDownEvent): void {
            if (this.__checkPoint(new Vector2(ev.x, ev.y))) {
                this.__hovered = true
                this.__material.map = hoverTexture
                this.__plane.material = this.__material
            } else {
                this.__hovered = false
                this.__material.map = texture
                this.__plane.material = this.__material
            }
        }

        globalMouseDown(ev: MouseDownEvent): void {
            if (this.__checkPoint(new Vector2(ev.x, ev.y))) {
                this.__waitClick = true
            }
        }

        globalMouseUp(ev: MouseDownEvent): void {
            super.globalMouseUp(ev)

            if (this.__checkPoint(new Vector2(ev.x, ev.y)) && this.__waitClick) {
                this.click()
            }

            this.__waitClick = false
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
