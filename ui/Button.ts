import Sprite from 'sky/views/Sprite'

declare global {
    namespace UI {
        type Button = lib.Button
        const Button: lib.Button
    }
}

namespace lib {
    const texture = ((): Three.CanvasTexture => {
        const ctx = document.createElement('canvas').getContext('2d')!
        document.body.appendChild(ctx.canvas)
        ctx.canvas.width = 256
        ctx.canvas.height = 256
        ctx.fillStyle = '#F00'
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
        return new Three.CanvasTexture(ctx.canvas)
    })()

    export interface ButtonParams {
        texture?: Three.Texture
    }
    export class Button extends Sprite {
        constructor(deps: EffectDeps) {
            super(deps)

            const geometry = new Three.PlaneGeometry(2, 2, 1, 1)
            const plane = new Three.Mesh(
                geometry,
                new Three.MeshBasicMaterial({
                    map: texture,
                })
            )

            this.view.add(plane)
        }
    }
}
