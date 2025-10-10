import Canvas from './Canvas'

// Common style props that work like Tailwind/Panda
interface BaseStyleProps {
    // Position
    x?: string | number
    y?: string | number

    // Size
    w?: string | number
    h?: string | number
    width?: string | number
    height?: string | number

    // Colors
    bg?: string
    fill?: string
    stroke?: string
    color?: string

    // Spacing
    p?: string | number
    px?: string | number
    py?: string | number
    pt?: string | number
    pr?: string | number
    pb?: string | number
    pl?: string | number
    m?: string | number
    mx?: string | number
    my?: string | number
    mt?: string | number
    mr?: string | number
    mb?: string | number
    ml?: string | number

    // Border
    border?: string
    borderWidth?: string | number
    borderColor?: string
    borderRadius?: string | number
    rounded?: string | number

    // Opacity and visibility
    opacity?: number
    visible?: boolean

    // Transform
    rotate?: number
    scale?: number
    scaleX?: number
    scaleY?: number

    // Common HTML-like attributes
    className?: string
    id?: string

    // Animation callback
    onUpdate?: (element: any, time: number, delta: number) => void
}

// Canvas JSX element types (lowercase)
declare global {
    namespace JSX {
        interface IntrinsicElements {
            // Canvas container
            canvas: {
                width?: number
                height?: number
                pixelRatio?: number
                className?: string
                id?: string
                children?: any
            }

            // Basic shapes
            rect: BaseStyleProps & {
                r?: string | number // border radius
                rx?: string | number
                ry?: string | number
            }

            circle: BaseStyleProps & {
                r?: string | number // radius
                radius?: string | number
                cx?: string | number // center x (alternative to x)
                cy?: string | number // center y (alternative to y)
            }

            ellipse: BaseStyleProps & {
                rx?: string | number
                ry?: string | number
                cx?: string | number
                cy?: string | number
            }

            line: BaseStyleProps & {
                x1?: string | number
                y1?: string | number
                x2?: string | number
                y2?: string | number
                strokeWidth?: string | number
            }

            path: BaseStyleProps & {
                d?: string // SVG path data
                strokeWidth?: string | number
                lineCap?: 'butt' | 'round' | 'square'
                lineJoin?: 'bevel' | 'round' | 'miter'
            }

            // Text
            text: BaseStyleProps & {
                fontSize?: string | number
                fontFamily?: string
                fontWeight?: string | number
                textAlign?: 'left' | 'center' | 'right' | 'start' | 'end'
                textBaseline?:
                    | 'top'
                    | 'hanging'
                    | 'middle'
                    | 'alphabetic'
                    | 'ideographic'
                    | 'bottom'
                children?: string | number
            }

            // Grouping
            group: BaseStyleProps & {
                children?: any
            }

            // Image
            image: BaseStyleProps & {
                src?: string
                alt?: string
            }
        }
    }
}

// Box component interface (uppercase, with asChild)
export interface BoxProps extends BaseStyleProps {
    asChild?: boolean
    children?: any
}

// Style parser for converting props to canvas operations
export class StyleParser {
    static parseSize(value: string | number | undefined): number {
        if (typeof value === 'number') return value

        if (typeof value === 'string') {
            // Handle rem, px, etc.
            if (value.endsWith('px')) return parseFloat(value)
            if (value.endsWith('rem')) return parseFloat(value) * 16
            if (value.endsWith('%')) return parseFloat(value) // Handle as percentage
            return parseFloat(value) || 0
        }

        return 0
    }

    static parseColor(color: string | undefined): string {
        if (!color) return 'transparent'

        // Handle Tailwind/Panda color tokens like 'red.500', 'blue.400'
        if (color.includes('.')) {
            const [colorName, shade] = color.split('.')
            return this.resolveTailwindColor(colorName, shade)
        }

        return color
    }

    private static resolveTailwindColor(colorName: string, shade: string): string {
        // Simple color mapping - в реальном проекте это будет более сложная система
        const colors: Record<string, Record<string, string>> = {
            red: {
                '100': '#fee2e2',
                '200': '#fecaca',
                '300': '#fca5a5',
                '400': '#f87171',
                '500': '#ef4444',
                '600': '#dc2626',
                '700': '#b91c1c',
                '800': '#991b1b',
                '900': '#7f1d1d',
            },
            blue: {
                '100': '#dbeafe',
                '200': '#bfdbfe',
                '300': '#93c5fd',
                '400': '#60a5fa',
                '500': '#3b82f6',
                '600': '#2563eb',
                '700': '#1d4ed8',
                '800': '#1e40af',
                '900': '#1e3a8a',
            },
            green: {
                '100': '#dcfce7',
                '200': '#bbf7d0',
                '300': '#86efac',
                '400': '#4ade80',
                '500': '#22c55e',
                '600': '#16a34a',
                '700': '#15803d',
                '800': '#166534',
                '900': '#14532d',
            },
            yellow: {
                '100': '#fef3c7',
                '200': '#fde68a',
                '300': '#fcd34d',
                '400': '#fbbf24',
                '500': '#f59e0b',
                '600': '#d97706',
                '700': '#b45309',
                '800': '#92400e',
                '900': '#78350f',
            },
        }

        return colors[colorName]?.[shade] || color
    }
}

// Canvas JSX Renderer
export class CanvasJSXRenderer {
    private canvas: Canvas
    private elements = new Map<string, any>()
    private updateCallbacks = new Map<string, (element: any, time: number, delta: number) => void>()
    private frameId: number | null = null
    private clock = { startTime: Date.now(), lastTime: Date.now() }

    constructor(canvas: Canvas) {
        this.canvas = canvas
        this.start()
    }

    render(element: JSX.Element | JSX.Element[]) {
        // Clear canvas
        this.canvas.clear()
        this.updateCallbacks.clear()

        // Render elements
        if (Array.isArray(element)) {
            element.forEach(el => this.renderElement(el))
        } else {
            this.renderElement(element)
        }
    }

    private renderElement(element: JSX.Element): void {
        if (!element) return

        const { type, props, children } = element
        const key = this.generateKey(type, props)

        switch (type) {
            case 'canvas':
                this.renderCanvas(props, children)
                break
            case 'rect':
                this.renderRect(props, key)
                break
            case 'circle':
                this.renderCircle(props, key)
                break
            case 'ellipse':
                this.renderEllipse(props, key)
                break
            case 'line':
                this.renderLine(props, key)
                break
            case 'path':
                this.renderPath(props, key)
                break
            case 'text':
                this.renderText(props, children, key)
                break
            case 'group':
                this.renderGroup(props, children, key)
                break
            case 'image':
                this.renderImage(props, key)
                break
        }
    }

    private generateKey(type: string | Function, props: any): string {
        const typeStr = typeof type === 'string' ? type : type.name
        const id = props.id || `${typeStr}_${Math.random().toString(36).substr(2, 9)}`
        return id
    }

    private renderCanvas(props: any, children: any) {
        // Canvas container properties
        if (props.width && props.height) {
            // Update canvas size if needed
            const [currentW, currentH] = this.canvas.size()

            if (currentW !== props.width || currentH !== props.height) {
                // Canvas size управляется извне через parameters
            }
        }

        // Render children
        if (Array.isArray(children)) {
            children.forEach(child => this.renderElement(child))
        } else if (children) {
            this.renderElement(children)
        }
    }

    private renderRect(props: any, key: string) {
        const x = StyleParser.parseSize(props.x)
        const y = StyleParser.parseSize(props.y)
        const width = StyleParser.parseSize(props.w || props.width)
        const height = StyleParser.parseSize(props.h || props.height)
        const fill = StyleParser.parseColor(props.bg || props.fill)
        const stroke = StyleParser.parseColor(props.stroke)
        const borderRadius = StyleParser.parseSize(props.rounded || props.borderRadius || props.r)

        this.canvas.save()

        // Apply transforms
        this.applyTransforms(props)

        // Draw rectangle
        if (borderRadius > 0) {
            this.drawRoundedRect(x, y, width, height, borderRadius)
        } else {
            this.canvas.rect(x, y, width, height)
        }

        if (fill && fill !== 'transparent') {
            this.canvas.setFillStyle(fill).fill()
        }

        if (stroke) {
            this.canvas.setStrokeStyle(stroke)

            if (props.borderWidth) {
                this.canvas.setLineWidth(StyleParser.parseSize(props.borderWidth))
            }

            this.canvas.stroke()
        }

        this.canvas.restore()

        // Add update callback
        if (props.onUpdate) {
            this.updateCallbacks.set(key, props.onUpdate)
        }
    }

    private renderCircle(props: any, key: string) {
        const x = StyleParser.parseSize(props.x || props.cx)
        const y = StyleParser.parseSize(props.y || props.cy)
        const radius = StyleParser.parseSize(props.r || props.radius)
        const fill = StyleParser.parseColor(props.bg || props.fill)
        const stroke = StyleParser.parseColor(props.stroke)

        this.canvas.save()

        // Apply transforms
        this.applyTransforms(props)

        this.canvas.beginPath().arc(x, y, radius, 0, Math.PI * 2)

        if (fill && fill !== 'transparent') {
            this.canvas.setFillStyle(fill).fill()
        }

        if (stroke) {
            this.canvas.setStrokeStyle(stroke)

            if (props.borderWidth) {
                this.canvas.setLineWidth(StyleParser.parseSize(props.borderWidth))
            }

            this.canvas.stroke()
        }

        this.canvas.restore()

        // Add update callback
        if (props.onUpdate) {
            this.updateCallbacks.set(key, props.onUpdate)
        }
    }

    private renderEllipse(props: any, key: string) {
        const x = StyleParser.parseSize(props.x || props.cx)
        const y = StyleParser.parseSize(props.y || props.cy)
        const rx = StyleParser.parseSize(props.rx)
        const ry = StyleParser.parseSize(props.ry)
        const fill = StyleParser.parseColor(props.bg || props.fill)
        const stroke = StyleParser.parseColor(props.stroke)

        this.canvas.save()

        // Apply transforms
        this.applyTransforms(props)

        this.canvas.beginPath().ellipse(x, y, rx, ry, 0, 0, Math.PI * 2)

        if (fill && fill !== 'transparent') {
            this.canvas.setFillStyle(fill).fill()
        }

        if (stroke) {
            this.canvas.setStrokeStyle(stroke).stroke()
        }

        this.canvas.restore()

        if (props.onUpdate) {
            this.updateCallbacks.set(key, props.onUpdate)
        }
    }

    private renderLine(props: any, key: string) {
        const x1 = StyleParser.parseSize(props.x1 || props.x)
        const y1 = StyleParser.parseSize(props.y1 || props.y)
        const x2 = StyleParser.parseSize(props.x2)
        const y2 = StyleParser.parseSize(props.y2)
        const stroke = StyleParser.parseColor(props.stroke || props.color)
        const strokeWidth = StyleParser.parseSize(props.strokeWidth)

        this.canvas.save()

        this.applyTransforms(props)

        this.canvas.beginPath().moveTo(x1, y1).lineTo(x2, y2)

        if (stroke) {
            this.canvas.setStrokeStyle(stroke)
        }

        if (strokeWidth) {
            this.canvas.setLineWidth(strokeWidth)
        }

        this.canvas.stroke()
        this.canvas.restore()

        if (props.onUpdate) {
            this.updateCallbacks.set(key, props.onUpdate)
        }
    }

    private renderPath(props: any, key: string) {
        // Path rendering would need a path parser
        // For now, simple implementation
        const fill = StyleParser.parseColor(props.bg || props.fill)
        const stroke = StyleParser.parseColor(props.stroke)

        this.canvas.save()
        this.applyTransforms(props)

        // TODO: Parse SVG path data in props.d

        if (fill && fill !== 'transparent') {
            this.canvas.setFillStyle(fill).fill()
        }

        if (stroke) {
            this.canvas.setStrokeStyle(stroke).stroke()
        }

        this.canvas.restore()

        if (props.onUpdate) {
            this.updateCallbacks.set(key, props.onUpdate)
        }
    }

    private renderText(props: any, children: any, key: string) {
        const x = StyleParser.parseSize(props.x)
        const y = StyleParser.parseSize(props.y)
        const text = children || ''
        const fill = StyleParser.parseColor(props.color || props.fill)
        const fontSize = StyleParser.parseSize(props.fontSize) || 16
        const fontFamily = props.fontFamily || 'Arial'
        const fontWeight = props.fontWeight || 'normal'

        this.canvas.save()

        this.applyTransforms(props)

        // Set font
        this.canvas.setFont(`${fontWeight} ${fontSize}px ${fontFamily}`)

        if (props.textAlign) {
            this.canvas.setTextAlign(props.textAlign)
        }

        if (props.textBaseline) {
            this.canvas.setTextBaseline(props.textBaseline)
        }

        if (fill && fill !== 'transparent') {
            this.canvas.setFillStyle(fill).fillText(text, x, y)
        }

        if (props.stroke) {
            this.canvas.setStrokeStyle(StyleParser.parseColor(props.stroke)).strokeText(text, x, y)
        }

        this.canvas.restore()

        if (props.onUpdate) {
            this.updateCallbacks.set(key, props.onUpdate)
        }
    }

    private renderGroup(props: any, children: any, key: string) {
        this.canvas.save()

        this.applyTransforms(props)

        // Render children
        if (Array.isArray(children)) {
            children.forEach(child => this.renderElement(child))
        } else if (children) {
            this.renderElement(children)
        }

        this.canvas.restore()

        if (props.onUpdate) {
            this.updateCallbacks.set(key, props.onUpdate)
        }
    }

    private renderImage(props: any, key: string) {
        // Image rendering implementation
        // Would need to load image and draw it
        console.log('Image rendering not implemented yet')

        if (props.onUpdate) {
            this.updateCallbacks.set(key, props.onUpdate)
        }
    }

    private applyTransforms(props: any) {
        if (props.rotate) {
            this.canvas.rotate((props.rotate * Math.PI) / 180)
        }

        if (props.scale) {
            this.canvas.scale(props.scale, props.scale)
        } else {
            if (props.scaleX) this.canvas.scale(props.scaleX, 1)
            if (props.scaleY) this.canvas.scale(1, props.scaleY)
        }

        if (props.opacity !== undefined) {
            this.canvas.setGlobalAlpha(props.opacity)
        }
    }

    private drawRoundedRect(x: number, y: number, width: number, height: number, radius: number) {
        this.canvas
            .beginPath()
            .moveTo(x + radius, y)
            .lineTo(x + width - radius, y)
            .arcTo(x + width, y, x + width, y + radius, radius)
            .lineTo(x + width, y + height - radius)
            .arcTo(x + width, y + height, x + width - radius, y + height, radius)
            .lineTo(x + radius, y + height)
            .arcTo(x, y + height, x, y + height - radius, radius)
            .lineTo(x, y + radius)
            .arcTo(x, y, x + radius, y, radius)
            .closePath()
    }

    private animate = () => {
        this.frameId = requestAnimationFrame(this.animate)

        const now = Date.now()
        const time = (now - this.clock.startTime) / 1000
        const delta = (now - this.clock.lastTime) / 1000
        this.clock.lastTime = now

        // Execute update callbacks
        this.updateCallbacks.forEach((callback, key) => {
            const element = this.elements.get(key)

            if (callback) {
                callback(element || {}, time, delta)
            }
        })

        // Re-render if there are update callbacks
        if (this.updateCallbacks.size > 0) {
            // Would need to trigger re-render here
        }
    }

    start() {
        if (!this.frameId) {
            this.animate()
        }
    }

    stop() {
        if (this.frameId) {
            cancelAnimationFrame(this.frameId)
            this.frameId = null
        }
    }

    dispose() {
        this.stop()
        this.elements.clear()
        this.updateCallbacks.clear()
    }
}
