import './_Canvas'
import './_Canvas.drawHexagon'
import './_Canvas.drawRoundedRect'
import './_Canvas.drawText'
import './_Canvas.measureText'
import './_Canvas.Sprite'
import './_Canvas.utilities'

declare global {
    interface CanvasRenderingContext2D {
        pixelRatio: number
    }
}
