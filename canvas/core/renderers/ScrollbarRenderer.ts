import Mesh from '../Mesh'
import { defaultScrollbarConfig, type ScrollbarConfig } from './ScrollbarConfig'

export interface ScrollbarRenderParams {
    object: Mesh
    x: number
    y: number
    pixelRatio: number
}

/**
 * Scrollbar renderer for canvas
 * Handles rendering of scrollbars for scrollable containers
 */
export class ScrollbarRenderer {
    private context: CanvasRenderingContext2D
    private config: ScrollbarConfig

    constructor(context: CanvasRenderingContext2D, config: ScrollbarConfig = defaultScrollbarConfig) {
        this.context = context
        this.config = config
    }

    /**
     * Render scrollbar for a scrollable box
     */
    render(params: ScrollbarRenderParams): void {
        const { object, x, y, pixelRatio } = params

        const contentHeight = object._contentHeight || 0
        const boxHeight = object._boxHeight || 0
        const boxWidth = object._boxWidth || 0

        // Only render if content exceeds box height
        if (contentHeight <= boxHeight) {
            return
        }

        // Get padding from box styles
        const styles = object._boxStyles || {}
        const paddingRight = parseFloat((styles.paddingRight || styles.padding || '0') as string)
        const paddingTop = parseFloat((styles.paddingTop || styles.padding || '0') as string)
        const paddingBottom = parseFloat((styles.paddingBottom || styles.padding || '0') as string)

        // Scrollbar dimensions
        const scrollbarWidth = this.config.width
        const scrollbarMargin = this.config.margin
        const scrollbarRadius = scrollbarWidth / 2 // Full rounding (pill shape)

        const scrollbarX = x + (boxWidth * pixelRatio) - (paddingRight * pixelRatio) - scrollbarWidth - scrollbarMargin
        const scrollbarY = y + (paddingTop * pixelRatio) + scrollbarMargin
        const scrollbarHeight = (boxHeight * pixelRatio) - (paddingTop * pixelRatio) - (paddingBottom * pixelRatio) - (scrollbarMargin * 2)

        // Calculate thumb size and position
        const thumbHeight = Math.max(this.config.minThumbHeight, (boxHeight / contentHeight) * scrollbarHeight)
        const scrollProgress = object._scrollY / (contentHeight - boxHeight)
        const thumbY = scrollbarY + scrollProgress * (scrollbarHeight - thumbHeight)

        // Draw scrollbar track (pill shape)
        this.context.fillStyle = this.config.trackColor
        this.drawRoundedRect(scrollbarX, scrollbarY, scrollbarWidth, scrollbarHeight, scrollbarRadius)

        // Draw scrollbar thumb (pill shape)
        this.context.fillStyle = this.config.thumbColor
        this.drawRoundedRect(scrollbarX, thumbY, scrollbarWidth, thumbHeight, scrollbarRadius)
    }

    /**
     * Draw rounded rectangle (pill shape for scrollbar)
     */
    private drawRoundedRect(x: number, y: number, width: number, height: number, radius: number): void {
        this.context.beginPath()
        this.context.moveTo(x + radius, y)
        this.context.lineTo(x + width - radius, y)
        this.context.arc(x + width - radius, y + radius, radius, -Math.PI / 2, 0)
        this.context.lineTo(x + width, y + height - radius)
        this.context.arc(x + width - radius, y + height - radius, radius, 0, Math.PI / 2)
        this.context.lineTo(x + radius, y + height)
        this.context.arc(x + radius, y + height - radius, radius, Math.PI / 2, Math.PI)
        this.context.lineTo(x, y + radius)
        this.context.arc(x + radius, y + radius, radius, Math.PI, Math.PI * 1.5)
        this.context.closePath()
        this.context.fill()
    }
}
