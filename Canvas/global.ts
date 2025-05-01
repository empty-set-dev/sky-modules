import './_Canvas.drawHexagon'
import './_Canvas.drawRoundedRect'
import './_Canvas.drawText'
import './_Canvas.measureText'
import './_Canvas.utils'

declare global {
    interface CanvasRenderingContext2D {
        devicePixelRatio: number
    }
}
