import { Geometry } from './Geometry'

export interface TextGeometryProps {
    text?: string
    x?: number
    y?: number
    font?: string
    fontSize?: number
    fontFamily?: string
    fontWeight?: string | number
    fontStyle?: string
    textAlign?: CanvasTextAlign
    textBaseline?: CanvasTextBaseline
    maxWidth?: number
}

export class TextGeometry extends Geometry {
    public text: string
    public x: number
    public y: number
    public font: string
    public fontSize: number
    public fontFamily: string
    public fontWeight: string | number
    public fontStyle: string
    public textAlign: CanvasTextAlign
    public textBaseline: CanvasTextBaseline
    public maxWidth?: number

    constructor(props: TextGeometryProps = {}) {
        super()
        this.text = props.text ?? ''
        this.x = props.x ?? 0
        this.y = props.y ?? 0
        this.fontSize = props.fontSize ?? 16
        this.fontFamily = props.fontFamily ?? 'sans-serif'
        this.fontWeight = props.fontWeight ?? 'normal'
        this.fontStyle = props.fontStyle ?? 'normal'
        this.textAlign = props.textAlign ?? 'left'
        this.textBaseline = props.textBaseline ?? 'top'
        this.maxWidth = props.maxWidth

        // Build font string if not provided
        this.font =
            props.font ??
            `${this.fontStyle} ${this.fontWeight} ${this.fontSize}px ${this.fontFamily}`
    }

    draw(ctx: CanvasRenderingContext2D, pixelRatio: number): void {
        ctx.font = this.font
        ctx.textAlign = this.textAlign
        ctx.textBaseline = this.textBaseline

        // Text rendering is handled differently - we need to use fillText/strokeText
        // The actual rendering will be done in the material's render method
        // Here we just set up the path for measurement purposes
        const x = this.x * pixelRatio
        const y = this.y * pixelRatio

        // Store text rendering data for material to use
        // We'll add a custom property that materials can read
        ;(ctx as any)._textData = {
            text: this.text,
            x,
            y,
            maxWidth: this.maxWidth ? this.maxWidth * pixelRatio : undefined,
        }
    }

    clone(): TextGeometry {
        return new TextGeometry({
            text: this.text,
            x: this.x,
            y: this.y,
            font: this.font,
            fontSize: this.fontSize,
            fontFamily: this.fontFamily,
            fontWeight: this.fontWeight,
            fontStyle: this.fontStyle,
            textAlign: this.textAlign,
            textBaseline: this.textBaseline,
            maxWidth: this.maxWidth,
        })
    }
}
