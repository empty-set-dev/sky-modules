import './_UI'
import { TextView } from 'pkgs/troika-three-text'
import Sprite from 'sky/views/Sprite'

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

    export interface ButtonParams {
        texture?: Three.Texture
        text: string
    }
    export class Button extends Sprite {
        textView: TextView

        constructor(deps: EffectDeps, params: ButtonParams) {
            super(deps)

            const geometry = new Three.PlaneGeometry(1, 0.1, 1, 1)
            const plane = new Three.Mesh(
                geometry,
                new Three.MeshBasicMaterial({
                    map: (params && params.texture) ?? texture,
                })
            )

            this.view.add(plane)

            this.textView = new TextView()
            this.textView.text = 'Test'
            this.textView.color = 0x0f0
            this.view.add(this.textView)
        }
    }
}

Object.assign(UI, lib)
