import globalify from '@sky-modules/core/globalify'

import { lib as CanvasSpritelib } from './_Canvas.Sprite'

declare global {
    interface CanvasParameters extends lib.CanvasParameters {}
    class Canvas extends lib.Canvas {}
}

namespace lib {
    export interface CanvasParameters {
        size(): [number, number]
        pixelRatio?: number
    }
    export class Canvas extends CanvasSpritelib.Sprite {
        static context = true

        size: () => [number, number]
        readonly domElement: HTMLCanvasElement
        readonly drawContext: CanvasRenderingContext2D
        readonly pixelRatio: number

        constructor(deps: EffectDeps, parameters: CanvasParameters) {
            super(deps)

            this.size = parameters.size

            this.domElement = document.createElement('canvas')
            this.domElement.style.transformOrigin = '0 0'
            this.drawContext = notNull(
                this.domElement.getContext('2d'),
                "Canvas: domElement.getContext('2d')"
            )
            this.pixelRatio = parameters.pixelRatio ?? window.devicePixelRatio

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

        drawRoundedRect(parameters: Canvas.DrawRoundRectParameters): this {
            parameters
            return null!
        }
        drawTopRoundedRect(parameters: Canvas.DrawRoundRectParameters): this {
            parameters
            return null!
        }
        drawBottomRoundedRect(parameters: Canvas.DrawRoundRectParameters): this {
            parameters
            return null!
        }
        drawRectWithoutTopBorder(parameters: Canvas.DrawRectWithoutTopBorderParameters): this {
            parameters
            return null!
        }

        moveTo(x: number, y: number): this {
            x
            y
            return null!
        }
        lineTo(x: number, y: number): this {
            x
            y
            return null!
        }
        arcTo(x1: number, y1: number, x2: number, y2: number, radius: number): this {
            x1
            y1
            x2
            y2
            radius
            return null!
        }

        drawHexagon(parameters: Canvas.DrawHexagonParameters): this {
            parameters
            return null!
        }

        drawImage(parameters: Canvas.DrawImageParameters): this {
            parameters
            return null!
        }

        drawText(parameters: Canvas.DrawTextParameters): this {
            parameters
            return null!
        }

        measureText(parameters: Canvas.MeasureTextParameters): TextMetrics {
            parameters
            return null!
        }

        protected draw(): void {
            this.clear()
        }
    }
}

globalify(lib)
