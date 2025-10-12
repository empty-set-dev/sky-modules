import { vi } from 'vitest'
import '@sky-modules/core/define/global'

// Mock Canvas API for testing
class MockCanvasRenderingContext2D {
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

    // Mock methods
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
    clearRect = vi.fn()
    fillRect = vi.fn()
    strokeRect = vi.fn()
    save = vi.fn()
    restore = vi.fn()
    scale = vi.fn()
    rotate = vi.fn()
    translate = vi.fn()
    transform = vi.fn()
    setTransform = vi.fn()
    resetTransform = vi.fn()
    fillText = vi.fn()
    strokeText = vi.fn()
    measureText = vi.fn(() => ({ width: 100 }) as TextMetrics)
    beginPath = vi.fn()
    clip = vi.fn()
}

class MockHTMLCanvasElement {
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
}

// Mock document.createElement for canvas
const originalCreateElement = document.createElement
document.createElement = function (tagName: string, options?: any) {
    if (tagName === 'canvas') {
        return new MockHTMLCanvasElement() as any
    }

    return originalCreateElement.call(this, tagName, options)
} as any

// Mock devicePixelRatio
Object.defineProperty(window, 'devicePixelRatio', {
    writable: true,
    configurable: true,
    value: 1,
})

// Also mock it globally
;(globalThis as any).devicePixelRatio = 1
;(globalThis as any).window = globalThis
