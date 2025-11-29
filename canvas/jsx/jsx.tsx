/* eslint-disable @typescript-eslint/no-explicit-any */
import { notUndefined } from '@sky-modules/core/not'
import { createContext, useContext, createRoot, createEffect, createSignal, batch, untrack } from 'solid-js'

import CanvasRenderer from '../core/CanvasRenderer'
import Group from '../core/Group'
import Mesh from '../core/Mesh'
import Scene from '../core/Scene'
import {
    RectGeometry as RectGeometryClass,
    CircleGeometry as CircleGeometryClass,
    PathGeometry as PathGeometryClass,
    EllipseGeometry as EllipseGeometryClass,
    PolylineGeometry as PolylineGeometryClass,
    SplineGeometry as SplineGeometryClass,
    TextGeometry as TextGeometryClass,
    Point,
    SplinePoint,
    SplineType,
} from '../geometries'
import {
    StrokeMaterial as StrokeMaterialClass,
    GradientMaterial as GradientMaterialClass,
    StrokeGradientMaterial as StrokeGradientMaterialClass,
    BasicMaterial as BasicMaterialClass,
    PatternMaterial as PatternMaterialClass,
    PatternRepetition,
} from '../materials'
import renderCSSToCanvas from '../rendering/renderCSSToCanvas'

import { Box } from './box/Box.implementation.tsx'
import { JSXPerformanceProfiler } from './utils/JSXPerformanceProfiler'
import { ScrollManager } from './utils/ScrollManager'
import { ObjectManager } from './utils/ObjectManager'
import { GeometryMaterialManager } from './utils/GeometryMaterialManager'
import { AnimationLoop } from './utils/AnimationLoop'

// Component Props Types
export interface SceneProps {
    background?: string | CanvasGradient | CanvasPattern
    children?: any
}

export interface MeshProps {
    ref?: (mesh: Mesh) => void
    position?: [number, number]
    rotation?: number
    scale?: [number, number]
    visible?: boolean
    onUpdate?: (mesh: Mesh, time: number, delta: number) => void
    children?: any
}

export interface GroupProps {
    position?: [number, number]
    rotation?: number
    scale?: [number, number]
    visible?: boolean
    onUpdate?: (group: Group, time: number, delta: number) => void
    children?: any
}

export interface RectGeometryProps {
    width?: number
    height?: number
    x?: number
    y?: number
}

export interface CircleGeometryProps {
    radius?: number
    x?: number
    y?: number
    startAngle?: number
    endAngle?: number
    counterclockwise?: boolean
}

export interface EllipseGeometryProps {
    radiusX?: number
    radiusY?: number
    x?: number
    y?: number
    rotation?: number
    startAngle?: number
    endAngle?: number
    counterclockwise?: boolean
}

export interface PathGeometryProps {}

export interface PolylineGeometryProps {
    points?: Point[]
    closed?: boolean
}

export interface SplineGeometryProps {
    points?: SplinePoint[]
    type?: SplineType
    tension?: number
    closed?: boolean
}

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

export interface StrokeMaterialProps {
    color?: string
    lineWidth?: number
    lineCap?: CanvasLineCap
    lineJoin?: CanvasLineJoin
    lineDash?: number[]
    lineDashOffset?: number
    opacity?: number
}

export interface GradientMaterialProps {
    gradient: CanvasGradient
    opacity?: number
}

export interface StrokeGradientMaterialProps {
    gradient: CanvasGradient
    color?: string
    lineWidth?: number
    lineCap?: CanvasLineCap
    lineJoin?: CanvasLineJoin
    lineDash?: number[]
    lineDashOffset?: number
    opacity?: number
}

export interface BasicMaterialProps {
    color?: string
    opacity?: number
    lineWidth?: number
    globalCompositeOperation?: GlobalCompositeOperation
}

export interface PatternMaterialProps {
    pattern?: CanvasPattern
    image?: CanvasImageSource
    repetition?: PatternRepetition
    scale?: number
    rotation?: number
    offsetX?: number
    offsetY?: number
    opacity?: number
    globalCompositeOperation?: GlobalCompositeOperation
}

export interface CanvasJSXRendererParameters {
    container?: HTMLElement
    canvas?: HTMLCanvasElement
    size?: () => [number, number]
}
export class CanvasJSXRenderer {
    canvas: CanvasRenderer
    scene: Scene

    // Composition modules
    private scrollManager: ScrollManager
    private objectManager: ObjectManager
    private geometryMaterialManager: GeometryMaterialManager
    private animationLoop: AnimationLoop

    // Rendering state
    private renderContext: { elementIndex: number; depth: number } = { elementIndex: 0, depth: 0 }
    private currentElement: any = null
    private solidDisposer: (() => void) | null = null
    private renderFunctionSignal:
        | [() => { fn: () => any } | null, (fn: { fn: () => any } | null) => void]
        | null = null
    private profiler = new JSXPerformanceProfiler()

    constructor(parameters?: CanvasJSXRendererParameters) {
        this.canvas = new CanvasRenderer({
            size: parameters?.size ?? (() => [400, 400]),
            ...(parameters?.canvas ? { canvas: parameters?.canvas } : null),
        })
        this.scene = new Scene()

        // Initialize composition modules
        this.objectManager = new ObjectManager(this.scene)
        this.geometryMaterialManager = new GeometryMaterialManager()
        this.scrollManager = new ScrollManager(this.canvas.domElement, this.scene)
        this.animationLoop = new AnimationLoop(
            this.canvas,
            this.scene,
            () => this.objectManager.getAllObjects()
        )

        // Set global canvas for useCanvas hook
        currentCanvas = this.canvas

        if (parameters?.container) {
            parameters.container.appendChild(this.canvas.domElement)
        }

        this.canvas.onResize()
        this.animationLoop.start()
        this.initReactiveRendering()
    }

    private initReactiveRendering(): void {
        this.solidDisposer = createRoot(dispose => {
            // Create signal for render function (stored in object to avoid function-in-signal issues)
            this.renderFunctionSignal = createSignal<{ fn: () => any } | null>(null)
            const [getRenderFunction] = this.renderFunctionSignal

            // Effect tracks the render function signal AND any signals read during execution
            createEffect(() => {
                const renderFnWrapper = getRenderFunction()

                if (renderFnWrapper) {
                    // Call render function - signals will be tracked and trigger re-renders!
                    let element = renderFnWrapper.fn()

                    // Unwrap functions to get the actual JSX element
                    // This allows components to return () => <JSX /> for reactive rendering
                    while (typeof element === 'function') {
                        element = element()
                    }

                    // Skip if element is null/undefined after unwrapping
                    if (!element) return

                    this.currentElement = element
                }

                // Always call renderDirectly inside createEffect to track signal reads
                if (this.currentElement) {
                    this.renderDirectly()
                }
            })

            return dispose
        })
    }

    // Main render function
    // Pass a function that creates the element tree - it will be called reactively
    render(elementOrFunction: any | any[] | (() => any)): void {
        console.log('[DEBUG JSX] render() called with:', elementOrFunction)
        if (elementOrFunction === null || elementOrFunction === undefined) {
            throw new Error('Cannot render null or undefined element')
        }

        // Check if it's a function (reactive render)
        if (typeof elementOrFunction === 'function') {
            if (this.renderFunctionSignal) {
                const [, setRenderFunction] = this.renderFunctionSignal
                // Store function in object to avoid Solid.js treating it as updater function
                setRenderFunction({ fn: elementOrFunction })
                // IMPORTANT: Call element function and render synchronously for initial render
                // createEffect runs asynchronously, so we need to render now for immediate display
                const element = elementOrFunction()
                this.currentElement = element
                this.renderDirectly()
            } else {
                // Fallback: call directly if signal not ready yet
                const element = elementOrFunction()
                this.currentElement = element
                this.renderDirectly()
            }
        } else {
            // Direct element - still need reactive rendering for props!
            // Wrap in a function that returns the static element
            if (this.renderFunctionSignal) {
                const [, setRenderFunction] = this.renderFunctionSignal
                this.currentElement = elementOrFunction
                // Create a wrapper function so createEffect tracks signal reads during render
                setRenderFunction({ fn: () => elementOrFunction })
                // IMPORTANT: Also render synchronously for the initial render
                // createEffect runs asynchronously, so we need to render now for immediate display
                this.renderDirectly()
            } else {
                this.currentElement = elementOrFunction
                this.renderDirectly()
            }
        }
    }

    private renderDirectly(): void {
        console.log('[DEBUG JSX] renderDirectly() called, currentElement:', this.currentElement)
        if (!this.currentElement) {
            console.log('[DEBUG JSX] No currentElement!')
            return
        }

        const t0 = performance.now()

        // Update cache stats and log if needed
        this.profiler.updateCacheStats(
            this.objectManager.cacheSize,
            this.animationLoop.callbacks.size,
            this.objectManager.renderOrderSize
        )
        this.profiler.logStats(t0)

        this.objectManager.clearUsedKeys()
        this.renderContext = { elementIndex: 0, depth: 0 }

        const t1 = performance.now()

        // Render children
        if (Array.isArray(this.currentElement)) {
            this.currentElement.forEach((el, index) => {
                this.renderContext.elementIndex = index
                this.renderElement(el, this.scene)
            })
        } else {
            this.renderContext.elementIndex = 0
            this.renderElement(this.currentElement, this.scene)
        }

        const t2 = performance.now()
        this.objectManager.cleanupUnusedObjects(this.animationLoop.callbacks)
        const t3 = performance.now()
        this.objectManager.sortSceneChildren()
        const t4 = performance.now()

        // DON'T render to canvas here - rendering happens ONLY in animate() loop!
        // This function only updates the JSX tree to canvas objects
        // Double rendering was causing updateMatrixWorld to be called 96x per object per frame!

        const t5 = performance.now()

        // Record timing
        this.profiler.recordTiming({
            render: t2 - t1,
            cleanup: t3 - t2,
            sort: t4 - t3,
            canvas: 0, // No canvas render here anymore
            total: t4 - t0,
        })

        // Log timing stats if needed
        this.profiler.logTimingStats(t5)
    }


    private renderElement(element: any, parent: Scene | Mesh | Group): any {
        if (!element) return null

        // Unwrap functions (from signals or getters) at the very beginning
        let unwrappedElement = element

        while (typeof unwrappedElement === 'function') {
            unwrappedElement = unwrappedElement()
        }

        // Handle primitive types: string, number, boolean
        if (
            typeof unwrappedElement === 'string' ||
            typeof unwrappedElement === 'number' ||
            typeof unwrappedElement === 'boolean'
        ) {
            element = unwrappedElement
            // Convert to string
            const text = String(element)

            // Inherit text styles from parent Box if available
            let fontSize = 16
            let fontFamily = 'sans-serif'
            let fontWeight: string | number = 'normal'
            let fontStyle = 'normal'
            let color = '#000000'
            let textAlign: CanvasTextAlign = 'left'
            let x = 0
            let y = 0
            let maxWidth: number | undefined

            if (parent instanceof Mesh && parent._isBox && parent._boxStyles) {
                const styles = parent._boxStyles

                if (styles.fontSize) {
                    fontSize =
                        typeof styles.fontSize === 'string'
                            ? parseFloat(styles.fontSize)
                            : styles.fontSize
                }

                if (styles.fontFamily) fontFamily = styles.fontFamily as string
                if (styles.fontWeight) fontWeight = styles.fontWeight
                if (styles.fontStyle) fontStyle = styles.fontStyle as string
                if (styles.color) color = styles.color as string
                if (styles.textAlign) textAlign = styles.textAlign

                // Calculate maxWidth for text wrapping (box width - padding)
                if (styles.width) {
                    const boxWidth =
                        typeof styles.width === 'string' ? parseFloat(styles.width) : styles.width
                    let paddingLeft = 0
                    let paddingRight = 0

                    if (styles.padding) {
                        const padding =
                            typeof styles.padding === 'string'
                                ? parseFloat(styles.padding)
                                : styles.padding
                        paddingLeft = padding as number
                        paddingRight = padding as number
                    }

                    if (styles.paddingLeft) {
                        paddingLeft =
                            typeof styles.paddingLeft === 'string'
                                ? parseFloat(styles.paddingLeft)
                                : (styles.paddingLeft as number)
                    }

                    if (styles.paddingRight) {
                        paddingRight =
                            typeof styles.paddingRight === 'string'
                                ? parseFloat(styles.paddingRight)
                                : (styles.paddingRight as number)
                    }

                    maxWidth = boxWidth - paddingLeft - paddingRight
                }

                // Apply padding for text positioning
                if (styles.padding) {
                    const padding =
                        typeof styles.padding === 'string'
                            ? parseFloat(styles.padding)
                            : styles.padding
                    x = padding as number
                    y = padding as number
                }

                if (styles.paddingLeft) {
                    x =
                        typeof styles.paddingLeft === 'string'
                            ? parseFloat(styles.paddingLeft)
                            : (styles.paddingLeft as number)
                }

                if (styles.paddingTop) {
                    y =
                        typeof styles.paddingTop === 'string'
                            ? parseFloat(styles.paddingTop)
                            : (styles.paddingTop as number)
                }
            }

            // Create a text mesh with inherited or default styling
            const textGeometry = new TextGeometryClass({
                text,
                x,
                y,
                fontSize,
                fontFamily,
                fontWeight,
                fontStyle,
                textAlign,
                maxWidth,
            })
            const textMaterial = new BasicMaterialClass({ color })
            const textMesh = new Mesh(textGeometry, textMaterial)

            // Generate a unique key for this text element
            const key = this.generateKey('Text', { text: element })
            this.objectManager.markKeyUsed(key, this.renderContext.elementIndex)

            // Add to parent
            parent.add(textMesh)
            this.objectManager.set(key, textMesh)
            this.objectManager.cache(key, textMesh)

            return textMesh
        }

        // Use unwrapped element for validation
        element = unwrappedElement

        // Validate element structure
        if (
            typeof element !== 'object' ||
            !Object.prototype.hasOwnProperty.call(element, 'props')
        ) {
            throw new Error('Element must be an object with props property')
        }

        let { type, props = {} } = element

        // Get type name (support both string and class)
        const typeName = typeof type === 'string' ? type : type?.name || 'unknown'

        // Handle function components (user components, not Canvas classes)
        if (
            typeof type === 'function' &&
            type !== Mesh &&
            type !== Scene &&
            type !== Group &&
            type !== Box
        ) {
            // Check if it's a class component with render method
            if (type.prototype && typeof type.prototype.render === 'function') {
                // Class component - instantiate and call render
                const instance = new (type as new (props: unknown) => { render: () => unknown })(
                    props
                )
                let result = instance.render()

                // Unwrap functions/getters (from Solid.js signals)
                while (typeof result === 'function') {
                    result = result()
                }

                return this.renderElement(result, parent)
            }

            // User function component - call it directly
            // It's called inside createEffect, so signals will be tracked
            let result = type(props)

            // Unwrap functions/getters (from Solid.js signals)
            while (typeof result === 'function') {
                result = result()
            }

            return this.renderElement(result, parent)
        }

        // Allow elements without children for some types
        if (
            props.children == null &&
            typeName !== 'Scene' &&
            typeName !== 'Mesh' &&
            typeName !== 'Group' &&
            typeName !== 'Fragment' &&
            typeName !== 'Box'
        ) {
            return
        }

        const key = this.generateKey(typeName, props)

        switch (typeName) {
            case 'Fragment':
                return this.renderFragment(props, props.children, parent)
            case 'Scene':
                return this.renderScene(props, props.children)
            case 'Mesh':
                return this.renderMesh(props, props.children, parent, key)
            case 'Group':
                return this.renderGroup(props, props.children, parent, key)
            case 'Box':
                // Box is a function component that returns a Mesh
                // Handle both function type and string type
                if (typeof type === 'function') {
                    return this.renderElement(type(props), parent)
                } else {
                    // String 'Box' - call the Box function
                    return this.renderElement(Box(props), parent)
                }
            case 'CanvasContextProvider':
                if (Array.isArray(props.children)) {
                    props.children.forEach((child: unknown) => this.renderElement(child, parent))
                } else if (props.children) {
                    this.renderElement(props.children, parent)
                }

                return parent
            default:
                return null
        }
    }

    private generateKey(type: string | Function, props: Record<string, unknown>): string {
        const typeStr = typeof type === 'string' ? type : type?.name || 'unknown'

        // Exclude dynamic properties that change every frame from key generation
        // Only use stable props for caching - position, rotation, etc change frequently
        const excludedProps = ['children', 'onUpdate', 'ref', 'position', 'rotation', 'scale', 'visible', 'opacity']
        const propKeys = Object.keys(props).filter(
            k => !excludedProps.includes(k)
        )
        const propHash = propKeys
            .sort()
            .map(k => {
                const value = props[k]
                // Safe serialization - avoid circular references
                if (value === null || value === undefined) {
                    return `${k}:${value}`
                }

                if (typeof value === 'object') {
                    // For objects, use constructor name or toString
                    return `${k}:${value.constructor?.name || '[object]'}`
                }

                return `${k}:${value}`
            })
            .join('|')

        // Create stable key using elementIndex for uniqueness across renders
        // elementIndex is stable for each element in the JSX tree order
        const baseKey = `${typeStr}_${propHash}_${this.renderContext.depth}_${this.renderContext.elementIndex}`

        return baseKey
    }

    private renderFragment(_props: any, children: any, parent: Scene | Mesh | Group): any {
        if (Array.isArray(children)) {
            children.forEach((child: any) => this.renderElement(child, parent))
        } else if (children) {
            this.renderElement(children, parent)
        }

        return parent
    }

    private renderScene(props: any, children: any): Scene {
        if (props.background !== undefined) {
            this.scene.setBackground(props.background)
        }

        if (Array.isArray(children)) {
            children.forEach(child => this.renderElement(child, this.scene))
        } else if (children) {
            this.renderElement(children, this.scene)
        }

        return this.scene
    }

    private renderMesh(props: any, children: any, parent: Scene | Mesh | Group, key: string): Mesh {
        // Mark this key as used
        this.objectManager.markKeyUsed(key, this.renderContext.elementIndex)

        // Check if we have a cached mesh for this key
        let mesh = this.objectManager.getCached(key) as Mesh

        if (!mesh) {
            // Create geometry and material from children
            let geometry: any = null
            let material: any = null
            let textContent: string | null = null

            const childrenArray = Array.isArray(children) ? children : children ? [children] : []

            childrenArray.forEach(child => {
                // Unwrap functions (from signals or getters)
                let unwrappedChild = child

                while (typeof unwrappedChild === 'function') {
                    unwrappedChild = unwrappedChild()
                }

                // Check if child is a primitive type
                if (
                    typeof unwrappedChild === 'string' ||
                    typeof unwrappedChild === 'number' ||
                    typeof unwrappedChild === 'boolean'
                ) {
                    textContent = String(unwrappedChild)
                } else if (unwrappedChild) {
                    const obj = this.geometryMaterialManager.createGeometryOrMaterial(unwrappedChild)

                    if (obj) {
                        if (obj && typeof obj === 'object' && 'draw' in obj) {
                            geometry = obj
                        } else if (obj && typeof obj === 'object' && 'render' in obj) {
                            material = obj
                        }
                    }
                }
            })

            // If we have text content but no geometry, create TextGeometry
            if (textContent !== null && !geometry) {
                geometry = new TextGeometryClass({ text: textContent })
            }

            // Use defaults if not provided
            if (!geometry) {
                geometry = new RectGeometryClass({ width: 100, height: 100 })
            }

            if (!material) {
                material = new BasicMaterialClass({ color: '#ffffff' })
            }

            mesh = new Mesh(geometry, material)
            if (props.ref) props.ref(mesh)
            this.objectManager.cache(key, mesh)
        }

        // Update geometry and material properties (always, like transform properties)
        const childrenArray = Array.isArray(children) ? children : children ? [children] : []
        childrenArray.forEach(child => {
            // Unwrap functions (from signals or getters)
            let unwrappedChild = child

            while (typeof unwrappedChild === 'function') {
                unwrappedChild = unwrappedChild()
            }

            // Update text content if it's a primitive
            if (
                typeof unwrappedChild === 'string' ||
                typeof unwrappedChild === 'number' ||
                typeof unwrappedChild === 'boolean'
            ) {
                if (mesh.geometry instanceof TextGeometryClass) {
                    mesh.geometry.text = String(unwrappedChild)
                }
            } else if (unwrappedChild) {
                this.geometryMaterialManager.updateGeometryOrMaterial(unwrappedChild, mesh)
            }
        })

        // Always update ref (it might have changed)
        if (props.ref) {
            props.ref(mesh)
        }

        // Update Box-specific properties
        if (props._isBox && props._boxStyles) {
            mesh._isBox = true
            mesh._boxStyles = props._boxStyles
        }

        // Unwrap getters from props (babel-preset-solid wraps reactive values)
        const position = typeof props.position === 'function' ? props.position() : props.position
        const rotation = typeof props.rotation === 'function' ? props.rotation() : props.rotation
        const scale = typeof props.scale === 'function' ? props.scale() : props.scale
        const visible = typeof props.visible === 'function' ? props.visible() : props.visible

        // Set transform properties
        if (position) {
            console.log('[jsx.tsx] Setting mesh position:', {
                meshId: props.id,
                position: position,
                isBox: props._isBox,
            })
            mesh.position.set(position[0], position[1])
            console.log('[jsx.tsx] Mesh position after set:', {
                meshId: props.id,
                x: mesh.position.x,
                y: mesh.position.y,
            })
        }
        if (rotation !== undefined) mesh.rotation = rotation
        if (scale) mesh.scale.set(scale[0], scale[1])
        if (visible !== undefined) mesh.visible = visible

        // Add update callback
        if (props.onUpdate) {
            this.animationLoop.addUpdateCallback(key, props.onUpdate)
        }

        // Call ref callback with mesh
        if (props.ref && typeof props.ref === 'function') {
            props.ref(mesh)
        }

        // Add to parent only if not already added
        if (mesh.parent !== parent) {
            if (mesh.parent) {
                mesh.parent.remove(mesh)
            }

            parent.add(mesh)
        }

        this.objectManager.set(key, mesh)

        // Render non-geometry/material children (like text or nested elements)
        // Only process children that are NOT geometry or material
        childrenArray.forEach(child => {
            // Unwrap functions (from signals or getters)
            let unwrappedChild = child

            while (typeof unwrappedChild === 'function') {
                unwrappedChild = unwrappedChild()
            }

            // Skip geometry and material children - they're already handled
            if (unwrappedChild && typeof unwrappedChild === 'object' && 'type' in unwrappedChild) {
                const childType = unwrappedChild.type
                const typeName = typeof childType === 'string' ? childType : childType?.name || ''

                // Skip geometry and material types
                if (
                    typeName === 'RectGeometry' ||
                    typeName === 'CircleGeometry' ||
                    typeName === 'EllipseGeometry' ||
                    typeName === 'PathGeometry' ||
                    typeName === 'PolylineGeometry' ||
                    typeName === 'SplineGeometry' ||
                    typeName === 'TextGeometry' ||
                    typeName === 'BasicMaterial' ||
                    typeName === 'StrokeMaterial' ||
                    typeName === 'GradientMaterial' ||
                    typeName === 'StrokeGradientMaterial' ||
                    typeName === 'PatternMaterial'
                ) {
                    return
                }

                // Render other elements (Mesh, Group, Box, etc.)
                this.renderElement(unwrappedChild, mesh)
            } else if (
                typeof unwrappedChild === 'string' ||
                typeof unwrappedChild === 'number' ||
                typeof unwrappedChild === 'boolean'
            ) {
                // Render primitive text as a child Mesh
                this.renderElement(unwrappedChild, mesh)
            }
        })

        return mesh
    }

    private renderGroup(
        props: any,
        children: any,
        parent: Scene | Mesh | Group,
        key: string
    ): Group {
        // Mark this key as used
        this.objectManager.markKeyUsed(key, this.renderContext.elementIndex)

        // Check if we have a cached group for this key
        let group = this.objectManager.getCached(key) as Group

        if (!group) {
            group = new Group()
            this.objectManager.cache(key, group)
        }

        // Always update properties (they might have changed)
        if (props.position) group.position.set(props.position[0], props.position[1])
        if (props.rotation !== undefined) group.rotation = props.rotation
        if (props.scale) group.scale.set(props.scale[0], props.scale[1])
        if (props.visible !== undefined) group.visible = props.visible

        // Add update callback
        if (props.onUpdate) {
            this.animationLoop.addUpdateCallback(key, props.onUpdate)
        }

        // Clear children and re-render (groups need to handle dynamic children)
        const currentChildren = [...group.children]
        currentChildren.forEach(child => group.remove(child))

        // Save current context and increase depth for children
        const prevDepth = this.renderContext.depth
        const prevIndex = this.renderContext.elementIndex
        this.renderContext.depth++

        const childrenArray = Array.isArray(children) ? children : children ? [children] : []
        childrenArray.forEach((child, index) => {
            this.renderContext.elementIndex = index
            this.renderElement(child, group)
        })

        // Restore context
        this.renderContext.depth = prevDepth
        this.renderContext.elementIndex = prevIndex

        // Add to parent only if not already added
        if (group.parent !== parent) {
            if (group.parent) {
                group.parent.remove(group)
            }

            parent.add(group)
        }

        this.objectManager.set(key, group)

        return group
    }


    setFrameCallback(callback: (() => void) | null): void {
        this.animationLoop.setFrameCallback(callback)
    }

    start(): void {
        this.animationLoop.start()
    }

    stop(): void {
        this.animationLoop.stop()
    }

    dispose(): void {
        if (this.solidDisposer) {
            this.solidDisposer()
            this.solidDisposer = null
        }

        this.scrollManager.dispose()
        this.animationLoop.stop()
        this.objectManager.clearAll()
    }
}

const CanvasContext = createContext<CanvasRenderer | undefined>()

// Global canvas instance for current renderer
let currentCanvas: CanvasRenderer | undefined = undefined

export function useCanvas(): CanvasRenderer {
    const contextCanvas = useContext(CanvasContext)
    return notUndefined(contextCanvas || currentCanvas, 'canvas context')
}

// Export classes for direct use in JSX
export {
    Scene,
    Mesh,
    Group,
    Box,
    RectGeometryClass as RectGeometry,
    CircleGeometryClass as CircleGeometry,
    EllipseGeometryClass as EllipseGeometry,
    PathGeometryClass as PathGeometry,
    PolylineGeometryClass as PolylineGeometry,
    SplineGeometryClass as SplineGeometry,
    TextGeometryClass as TextGeometry,
    BasicMaterialClass as BasicMaterial,
    StrokeMaterialClass as StrokeMaterial,
    GradientMaterialClass as GradientMaterial,
    StrokeGradientMaterialClass as StrokeGradientMaterial,
    PatternMaterialClass as PatternMaterial,
}

// Export Box types
export type { BoxProps } from './box/Box.implementation.tsx'

// Export CSS and style utilities
export { mergeTailwindClasses, tailwindClassesToCSS } from './box/twrn'
export {
    extractDirectCSSProps,
    mergeStyles,
    normalizeProperties,
    parseUnit,
    parseSpacing,
    kebabToCamel,
    type ParsedStyles,
} from './box/styles-parser'
export type { CSSProperties } from '../rendering/renderCSSToCanvas'
export { default as renderCSSToCanvas } from '../rendering/renderCSSToCanvas'
