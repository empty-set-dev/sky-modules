import Mesh from '../../core/Mesh'
import Scene from '../../core/Scene'

/**
 * Scroll manager for Canvas JSX
 * Handles mouse wheel scrolling and scrollbar dragging for overflow containers
 *
 * Features:
 * - Mouse wheel scrolling for overflow:auto/scroll containers
 * - Scrollbar drag-to-scroll interaction
 * - Automatic scrollbar bounds calculation
 * - Nested scrollable container support
 *
 * @example
 * ```typescript
 * const scrollManager = new ScrollManager(canvas.domElement, scene)
 *
 * // Scrolling is handled automatically via event listeners
 * // Get scrollbar bounds for rendering
 * const bounds = scrollManager.getScrollbarThumbBounds(box)
 *
 * // Cleanup when done
 * scrollManager.dispose()
 * ```
 */
export class ScrollManager {
    private isDraggingScrollbar = false
    private draggedBox: Mesh | null = null
    private dragStartY = 0
    private dragStartScrollY = 0
    private canvasElement: HTMLCanvasElement
    private scene: Scene

    constructor(canvasElement: HTMLCanvasElement, scene: Scene) {
        this.canvasElement = canvasElement
        this.scene = scene

        // Add event listeners
        this.canvasElement.addEventListener('wheel', this.handleWheel, { passive: false })
        this.canvasElement.addEventListener('mousedown', this.handleMouseDown)
        this.canvasElement.addEventListener('mousemove', this.handleMouseMove)
        this.canvasElement.addEventListener('mouseup', this.handleMouseUp)
    }

    /**
     * Find scrollable Box under cursor position
     */
    private findScrollableBoxUnderCursor(x: number, y: number): Mesh | null {
        const findInChildren = (children: any[]): Mesh | null => {
            for (let i = children.length - 1; i >= 0; i--) {
                const child = children[i]

                if (!(child instanceof Mesh) || !child.visible) continue

                const transform = child.getWorldTransform()
                const meshX = transform.position.x
                const meshY = transform.position.y

                if (
                    child._isBox &&
                    child._boxStyles &&
                    (child._boxStyles.overflow === 'auto' ||
                        child._boxStyles.overflow === 'scroll' ||
                        child._boxStyles.overflowY === 'auto' ||
                        child._boxStyles.overflowY === 'scroll')
                ) {
                    const width = child._boxWidth || 0
                    const height = child._boxHeight || 0

                    if (x >= meshX && x <= meshX + width && y >= meshY && y <= meshY + height) {
                        const childResult = findInChildren(child.children)
                        if (childResult) return childResult
                        return child
                    }
                }

                const childResult = findInChildren(child.children)
                if (childResult) return childResult
            }

            return null
        }

        return findInChildren(this.scene.children)
    }

    /**
     * Calculate scrollbar thumb bounds for a box
     */
    getScrollbarThumbBounds(box: Mesh): {
        x: number
        y: number
        width: number
        height: number
        scrollbarHeight: number
        thumbHeight: number
    } | null {
        const contentHeight = box._contentHeight || 0
        const boxHeight = box._boxHeight || 0
        const boxWidth = box._boxWidth || 0

        if (contentHeight <= boxHeight) return null

        const transform = box.getWorldTransform()
        const x = transform.position.x
        const y = transform.position.y

        const styles = box._boxStyles || {}
        const paddingRight = parseFloat(styles.paddingRight || styles.padding || '0')
        const paddingTop = parseFloat(styles.paddingTop || styles.padding || '0')
        const paddingBottom = parseFloat(styles.paddingBottom || styles.padding || '0')

        const scrollbarWidth = 12
        const scrollbarMargin = 2
        const scrollbarX = x + boxWidth - paddingRight - scrollbarWidth - scrollbarMargin
        const scrollbarY = y + paddingTop + scrollbarMargin
        const scrollbarHeight = boxHeight - paddingTop - paddingBottom - scrollbarMargin * 2

        const thumbHeight = Math.max(30, (boxHeight / contentHeight) * scrollbarHeight)
        const scrollProgress = box._scrollY / (contentHeight - boxHeight)
        const thumbY = scrollbarY + scrollProgress * (scrollbarHeight - thumbHeight)

        return {
            x: scrollbarX,
            y: thumbY,
            width: scrollbarWidth,
            height: thumbHeight,
            scrollbarHeight,
            thumbHeight,
        }
    }

    /**
     * Handle wheel events for scrolling
     */
    private handleWheel = (event: WheelEvent): void => {
        const rect = this.canvasElement.getBoundingClientRect()
        const x = event.clientX - rect.left
        const y = event.clientY - rect.top

        const box = this.findScrollableBoxUnderCursor(x, y)

        if (box) {
            event.preventDefault()

            const scrollDelta = event.deltaY
            box._scrollY += scrollDelta

            const contentHeight = box._contentHeight || 0
            const boxHeight = box._boxHeight || 0
            const maxScroll = Math.max(0, contentHeight - boxHeight)

            box._scrollY = Math.max(0, Math.min(box._scrollY, maxScroll))
        }
    }

    /**
     * Handle mouse down for scrollbar dragging
     */
    private handleMouseDown = (event: MouseEvent): void => {
        const rect = this.canvasElement.getBoundingClientRect()
        const x = event.clientX - rect.left
        const y = event.clientY - rect.top

        const findScrollableBox = (children: any[]): Mesh | null => {
            for (let i = children.length - 1; i >= 0; i--) {
                const child = children[i]

                if (!(child instanceof Mesh) || !child.visible) continue

                if (
                    child._isBox &&
                    child._boxStyles &&
                    (child._boxStyles.overflow === 'auto' || child._boxStyles.overflow === 'scroll')
                ) {
                    const bounds = this.getScrollbarThumbBounds(child)

                    if (bounds) {
                        if (
                            x >= bounds.x &&
                            x <= bounds.x + bounds.width &&
                            y >= bounds.y &&
                            y <= bounds.y + bounds.height
                        ) {
                            return child
                        }
                    }
                }

                const childResult = findScrollableBox(child.children)
                if (childResult) return childResult
            }

            return null
        }

        const box = findScrollableBox(this.scene.children)

        if (box) {
            this.isDraggingScrollbar = true
            this.draggedBox = box
            this.dragStartY = y
            this.dragStartScrollY = box._scrollY
            event.preventDefault()
        }
    }

    /**
     * Handle mouse move for scrollbar dragging
     */
    private handleMouseMove = (event: MouseEvent): void => {
        if (!this.isDraggingScrollbar || !this.draggedBox) return

        const rect = this.canvasElement.getBoundingClientRect()
        const y = event.clientY - rect.top

        const deltaY = y - this.dragStartY

        const bounds = this.getScrollbarThumbBounds(this.draggedBox)
        if (!bounds) return

        const contentHeight = this.draggedBox._contentHeight || 0
        const boxHeight = this.draggedBox._boxHeight || 0
        const maxScroll = Math.max(0, contentHeight - boxHeight)

        const availableSpace = bounds.scrollbarHeight - bounds.thumbHeight
        const scrollDelta = (deltaY / availableSpace) * maxScroll

        this.draggedBox._scrollY = this.dragStartScrollY + scrollDelta
        this.draggedBox._scrollY = Math.max(0, Math.min(this.draggedBox._scrollY, maxScroll))
    }

    /**
     * Handle mouse up to end scrollbar dragging
     */
    private handleMouseUp = (): void => {
        this.isDraggingScrollbar = false
        this.draggedBox = null
        this.dragStartY = 0
        this.dragStartScrollY = 0
    }

    /**
     * Cleanup event listeners
     */
    dispose(): void {
        this.canvasElement.removeEventListener('wheel', this.handleWheel)
        this.canvasElement.removeEventListener('mousedown', this.handleMouseDown)
        this.canvasElement.removeEventListener('mousemove', this.handleMouseMove)
        this.canvasElement.removeEventListener('mouseup', this.handleMouseUp)
    }
}
