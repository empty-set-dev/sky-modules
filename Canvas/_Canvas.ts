import globalify from 'sky/utilities/globalify'

declare global {
    class Canvas extends module.Canvas {}
}

namespace module {
    export interface CanvasParameters {
        size(): [number, number]
        pixelRatio?: number
    }
    export class Canvas {
        readonly effect: Effect
        size: () => [number, number]
        readonly domElement: HTMLCanvasElement
        readonly drawContext: CanvasRenderingContext2D

        constructor(deps: EffectDeps, parameters: CanvasParameters) {
            this.effect = new Effect(deps, this)

            this.size = parameters.size

            this.domElement = document.createElement('canvas')
            this.domElement.style.transformOrigin = '0 0'
            this.drawContext = this.domElement.getContext('2d')!
            this.drawContext.pixelRatio = parameters.pixelRatio ?? 1

            this.onResize()
            new WindowEventListener('resize', () => this.onResize(), this.effect)
        }

        onResize(): this {
            const [w, h] = this.size()
            this.domElement.width = w * window.devicePixelRatio
            this.domElement.height = h * window.devicePixelRatio
            this.domElement.style.transform = `scale(${(100 / window.devicePixelRatio).toFixed(2)}%)`
            return this
        }

        clear(): this {
            this.drawContext.clearRect(0, 0, this.domElement.width, this.domElement.height)
            return this
        }
    }
}

globalify(module)
