import { vi } from 'vitest'

/**
 * Mock implementation of CanvasRenderingContext2D for testing
 */
export class MockCanvasRenderingContext2D {
    fillStyle: string | CanvasGradient | CanvasPattern = '#000000'
    strokeStyle: string | CanvasGradient | CanvasPattern = '#000000'
    globalAlpha = 1
    lineWidth = 1
    lineCap: CanvasLineCap = 'butt'
    lineJoin: CanvasLineJoin = 'miter'
    lineDashOffset = 0
    shadowBlur = 0
    shadowColor = 'transparent'
    shadowOffsetX = 0
    shadowOffsetY = 0
    globalCompositeOperation: GlobalCompositeOperation = 'source-over'
    font = '10px sans-serif'
    textAlign: CanvasTextAlign = 'start'
    textBaseline: CanvasTextBaseline = 'alphabetic'
    canvas: any = { width: 800, height: 600 }

    // Drawing methods
    rect = vi.fn()
    arc = vi.fn()
    ellipse = vi.fn()
    moveTo = vi.fn()
    lineTo = vi.fn()
    bezierCurveTo = vi.fn()
    quadraticCurveTo = vi.fn()
    arcTo = vi.fn()
    closePath = vi.fn()
    fill = vi.fn()
    stroke = vi.fn()
    setLineDash = vi.fn()
    clearRect = vi.fn()
    fillRect = vi.fn()
    strokeRect = vi.fn()
    beginPath = vi.fn()
    clip = vi.fn()

    // Transform methods
    save = vi.fn()
    restore = vi.fn()
    scale = vi.fn()
    rotate = vi.fn()
    translate = vi.fn()
    transform = vi.fn()
    setTransform = vi.fn()
    resetTransform = vi.fn()

    // Text methods
    fillText = vi.fn()
    strokeText = vi.fn()
    measureText = vi.fn(() => ({ width: 100 }) as TextMetrics)

    // Gradient and pattern methods
    createLinearGradient = vi.fn(
        () =>
            ({
                addColorStop: vi.fn(),
            }) as any
    )
    createRadialGradient = vi.fn(
        () =>
            ({
                addColorStop: vi.fn(),
            }) as any
    )
    createPattern = vi.fn(() => ({}) as any)
}

/**
 * Mock implementation of HTMLCanvasElement for testing
 */
export class MockHTMLCanvasElement {
    private _width = 300
    private _height = 150

    get width() {
        return this._width
    }
    set width(value: number) {
        this._width = value
    }

    get height() {
        return this._height
    }
    set height(value: number) {
        this._height = value
    }

    style: any = {}
    tagName = 'CANVAS'
    nodeName = 'CANVAS'
    nodeType = 1
    ownerDocument = document
    parentNode: Node | null = null
    childNodes: Node[] = []
    firstChild: Node | null = null
    lastChild: Node | null = null
    nextSibling: Node | null = null
    previousSibling: Node | null = null

    getContext(contextId: string): MockCanvasRenderingContext2D | null {
        if (contextId === '2d') {
            return new MockCanvasRenderingContext2D() as any
        }

        return null
    }

    // Node methods
    appendChild(child: Node): Node {
        return child
    }

    removeChild(child: Node): Node {
        return child
    }

    insertBefore(newNode: Node, referenceNode: Node | null): Node {
        return newNode
    }

    cloneNode(deep?: boolean): Node {
        return new MockHTMLCanvasElement() as any
    }

    contains(other: Node | null): boolean {
        return false
    }

    hasChildNodes(): boolean {
        return false
    }

    // Event methods (needed for canvas event handling)
    addEventListener = vi.fn()
    removeEventListener = vi.fn()
    dispatchEvent = vi.fn(() => true)

    // Additional DOM methods
    getBoundingClientRect = vi.fn(() => ({
        x: 0,
        y: 0,
        width: this._width,
        height: this._height,
        top: 0,
        right: this._width,
        bottom: this._height,
        left: 0,
        toJSON: () => {},
    }))

    getClientRects = vi.fn(() => [])
    scrollIntoView = vi.fn()
    scrollTo = vi.fn()
    setAttribute = vi.fn()
    getAttribute = vi.fn(() => null)
    removeAttribute = vi.fn()
    hasAttribute = vi.fn(() => false)
}

/**
 * Setup Canvas mocks in global scope
 * Call this in your test setup file or at the start of test suites
 */
export function setupCanvasMocks() {
    // Mock document.createElement for canvas
    if (typeof document !== 'undefined') {
        const originalCreateElement = document.createElement
        document.createElement = function (tagName: string, options?: any) {
            if (tagName === 'canvas') {
                return new MockHTMLCanvasElement() as any
            }

            return originalCreateElement.call(this, tagName, options)
        } as any
    }

    // Mock devicePixelRatio
    if (typeof window !== 'undefined') {
        Object.defineProperty(window, 'devicePixelRatio', {
            writable: true,
            configurable: true,
            value: 1,
        })
    }

    // Also mock it globally
    ;(globalThis as any).devicePixelRatio = 1
    ;(globalThis as any).window = globalThis
}
