/* eslint-disable @typescript-eslint/no-explicit-any */
import { notUndefined } from '@sky-modules/core/not'
import { createContext, useContext, createRoot, createEffect, createSignal, batch, createMemo } from 'solid-js'

import CanvasRenderer from './CanvasRenderer'
import {
    RectGeometry as RectGeometryClass,
    CircleGeometry as CircleGeometryClass,
    PathGeometry as PathGeometryClass,
    EllipseGeometry as EllipseGeometryClass,
    PolylineGeometry as PolylineGeometryClass,
    SplineGeometry as SplineGeometryClass,
    Point,
    SplinePoint,
    SplineType,
} from './geometries'
import Group from './Group'
import {
    StrokeMaterial as StrokeMaterialClass,
    GradientMaterial as GradientMaterialClass,
    StrokeGradientMaterial as StrokeGradientMaterialClass,
    BasicMaterial as BasicMaterialClass,
} from './materials'
import Mesh from './Mesh'
import Scene from './Scene'

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
}

export interface CanvasJSXRendererParameters {
    container?: HTMLElement
    canvas?: HTMLCanvasElement
    size?: () => [number, number]
}
export class CanvasJSXRenderer {
    canvas: CanvasRenderer
    scene: Scene

    private frameId: number | null = null
    private clock = { start: Date.now(), lastTime: Date.now() }
    private updateCallbacks = new Map<string, (obj: any, time: number, delta: number) => void>()
    private objects = new Map<string, Mesh | Group>()
    private objectCache = new Map<string, Mesh | Group>()
    private usedKeys = new Set<string>()
    private renderContext: { elementIndex: number; depth: number } = { elementIndex: 0, depth: 0 }
    private currentElement: any = null
    private keyCounters = new Map<string, number>()
    private solidDisposer: (() => void) | null = null
    private renderFunctionSignal: [() => { fn: (() => any) } | null, (fn: { fn: (() => any) } | null) => void] | null = null

    constructor(parameters?: CanvasJSXRendererParameters) {
        this.canvas = new CanvasRenderer({
            size: parameters?.size ?? (() => [400, 400]),
            ...(parameters?.canvas ? { canvas: parameters?.canvas } : null),
        })
        this.scene = new Scene()

        // Set global canvas for useCanvas hook
        currentCanvas = this.canvas

        if (parameters?.container) {
            parameters.container.appendChild(this.canvas.domElement)
        }

        this.canvas.onResize()
        this.start()
        this.initReactiveRendering()
    }

    private initReactiveRendering(): void {
        this.solidDisposer = createRoot(dispose => {
            // Create signal for render function (stored in object to avoid function-in-signal issues)
            this.renderFunctionSignal = createSignal<{ fn: (() => any) } | null>(null)
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
                    this.renderDirectly()
                }
            })

            return dispose
        })
    }

    // Main render function
    // Pass a function that creates the element tree - it will be called reactively
    render(elementOrFunction: any | any[] | (() => any)): void {
        if (elementOrFunction === null || elementOrFunction === undefined) {
            throw new Error('Cannot render null or undefined element')
        }

        // Check if it's a function (reactive render)
        if (typeof elementOrFunction === 'function') {
            if (this.renderFunctionSignal) {
                const [, setRenderFunction] = this.renderFunctionSignal
                // Store function in object to avoid Solid.js treating it as updater function
                setRenderFunction({ fn: elementOrFunction })
            } else {
                // Fallback: call directly if signal not ready yet
                const element = elementOrFunction()
                this.currentElement = element
                this.renderDirectly()
            }
        } else {
            // Direct element (non-reactive)
            // Stop reactivity by clearing the render function signal
            if (this.renderFunctionSignal) {
                const [, setRenderFunction] = this.renderFunctionSignal
                setRenderFunction(null)
            }
            this.currentElement = elementOrFunction
            this.renderDirectly()
        }
    }

    private renderDirectly(): void {
        if (!this.currentElement) return

        this.usedKeys.clear()
        this.updateCallbacks.clear()
        this.keyCounters.clear()
        this.renderContext = { elementIndex: 0, depth: 0 }

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

        this.cleanupUnusedObjects()
        this.canvas.render(this.scene)
    }

    private clearScene(): void {
        const objectsToRemove = [...this.scene.children]
        objectsToRemove.forEach(obj => {
            this.scene.remove(obj)
        })
        this.objects.clear()
        this.objectCache.clear()
        this.usedKeys.clear()
    }

    private cleanupUnusedObjects(): void {
        // Remove objects that weren't used in this render cycle
        for (const [key, obj] of this.objectCache) {
            if (!this.usedKeys.has(key)) {
                // Remove from scene and cache
                if (obj.parent) {
                    obj.parent.remove(obj)
                }

                this.objectCache.delete(key)
                this.objects.delete(key)
            }
        }
    }


    private renderElement(element: any, parent: Scene | Mesh | Group): any {
        if (!element) return null

        // Validate element structure
        if (typeof element !== 'object' || !element.hasOwnProperty('props')) {
            console.error('Invalid element:', element)
            throw new Error('Element must be an object with props property')
        }

        let { type, props = {} } = element

        // Get type name (support both string and class)
        const typeName = typeof type === 'string' ? type : type?.name || 'unknown'

        // Handle function components (user components, not Canvas classes)
        if (typeof type === 'function' && type !== Mesh && type !== Scene && type !== Group) {
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
        if (props.children == null && typeName !== 'Scene' && typeName !== 'Mesh' && typeName !== 'Group' && typeName !== 'Fragment') {
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

        // Create stable key based on props content with safe serialization
        const propKeys = Object.keys(props).filter(
            k => k !== 'children' && k !== 'onUpdate' && k !== 'ref'
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

        // Create base key without position
        const baseKey = `${typeStr}_${propHash}_${this.renderContext.depth}`

        // For elements with identical props, add a counter to ensure uniqueness
        if (!this.keyCounters.has(baseKey)) {
            this.keyCounters.set(baseKey, 0)
            return baseKey
        } else {
            const counter = this.keyCounters.get(baseKey)! + 1
            this.keyCounters.set(baseKey, counter)
            return `${baseKey}_${counter}`
        }
    }

    private renderFragment(
        _props: any,
        children: any,
        parent: Scene | Mesh | Group
    ): any {
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

    private renderMesh(
        props: any,
        children: any,
        parent: Scene | Mesh | Group,
        key: string
    ): Mesh {
        // Mark this key as used
        this.usedKeys.add(key)

        // Check if we have a cached mesh for this key
        let mesh = this.objectCache.get(key) as Mesh

        if (!mesh) {
            // Create geometry and material from children
            let geometry: any = null
            let material: any = null

            const childrenArray = Array.isArray(children) ? children : children ? [children] : []

            childrenArray.forEach(child => {
                const obj = this.createGeometryOrMaterial(child)

                if (obj) {
                    if (obj && typeof obj === 'object' && 'draw' in obj) {
                        geometry = obj
                    } else if (obj && typeof obj === 'object' && 'render' in obj) {
                        material = obj
                    }
                }
            })

            // Use defaults if not provided
            if (!geometry) {
                geometry = new RectGeometryClass({ width: 100, height: 100 })
            }

            if (!material) {
                material = new BasicMaterialClass({ color: '#ffffff' })
            }

            mesh = new Mesh(geometry, material)
            if (props.ref) props.ref(mesh)
            this.objectCache.set(key, mesh)
        }

        // Always update ref (it might have changed)
        if (props.ref) {
            props.ref(mesh)
        }

        // Unwrap getters from props (babel-preset-solid wraps reactive values)
        const position = typeof props.position === 'function' ? props.position() : props.position
        const rotation = typeof props.rotation === 'function' ? props.rotation() : props.rotation
        const scale = typeof props.scale === 'function' ? props.scale() : props.scale
        const visible = typeof props.visible === 'function' ? props.visible() : props.visible

        // Set transform properties
        if (position) mesh.position.set(position[0], position[1])
        if (rotation !== undefined) mesh.rotation = rotation
        if (scale) mesh.scale.set(scale[0], scale[1])
        if (visible !== undefined) mesh.visible = visible

        // Add update callback
        if (props.onUpdate) {
            this.updateCallbacks.set(key, props.onUpdate)
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

        this.objects.set(key, mesh)

        return mesh
    }

    private renderGroup(
        props: any,
        children: any,
        parent: Scene | Mesh | Group,
        key: string
    ): Group {
        // Mark this key as used
        this.usedKeys.add(key)

        // Check if we have a cached group for this key
        let group = this.objectCache.get(key) as Group

        if (!group) {
            group = new Group()
            this.objectCache.set(key, group)
        }

        // Always update properties (they might have changed)
        if (props.position) group.position.set(props.position[0], props.position[1])
        if (props.rotation !== undefined) group.rotation = props.rotation
        if (props.scale) group.scale.set(props.scale[0], props.scale[1])
        if (props.visible !== undefined) group.visible = props.visible

        // Add update callback
        if (props.onUpdate) {
            this.updateCallbacks.set(key, props.onUpdate)
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

        this.objects.set(key, group)

        return group
    }

    private createGeometryOrMaterial(element: any): any {
        // Validate element structure
        if (!element.hasOwnProperty('props')) {
            throw new Error('Element must have props property')
        }

        let { type, props } = element

        // Handle function components
        if (typeof type === 'function' && !type.prototype) {
            const resolved = type(props)
            return this.createGeometryOrMaterial(resolved)
        }

        // Get type name for switch (support both string and class)
        const typeName = typeof type === 'string' ? type : type?.name || 'unknown'

        switch (typeName) {
            // Geometries
            case 'RectGeometry':
                return new RectGeometryClass(props)
            case 'CircleGeometry':
                return new CircleGeometryClass(props)
            case 'EllipseGeometry':
                return new EllipseGeometryClass(props)
            case 'PathGeometry':
                return new PathGeometryClass()
            case 'PolylineGeometry':
                return new PolylineGeometryClass(props)
            case 'SplineGeometry':
                return new SplineGeometryClass(props)

            // Materials
            case 'StrokeMaterial':
                return new StrokeMaterialClass(props)
            case 'GradientMaterial':
                return new GradientMaterialClass(props)
            case 'StrokeGradientMaterial':
                return new StrokeGradientMaterialClass(props)
            case 'BasicMaterial':
                return new BasicMaterialClass(props)

            default:
                return null
        }
    }

    private animate = (): void => {
        this.frameId = requestAnimationFrame(this.animate)

        const now = Date.now()
        const time = (now - this.clock.start) / 1000
        const delta = (now - this.clock.lastTime) / 1000
        this.clock.lastTime = now

        // Execute update callbacks inside batch to group all signal updates
        batch(() => {
            this.updateCallbacks.forEach((callback, key) => {
                const obj = this.objects.get(key)

                if (obj && callback) {
                    callback(obj, time, delta)
                }
            })
        })

        // Render the scene
        this.canvas.render(this.scene)
    }

    start(): void {
        if (!this.frameId) {
            this.animate()
        }
    }

    stop(): void {
        if (this.frameId) {
            cancelAnimationFrame(this.frameId)
            this.frameId = null
        }
    }

    dispose(): void {
        if (this.solidDisposer) {
            this.solidDisposer()
            this.solidDisposer = null
        }
        this.stop()
        this.clearScene()
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
    RectGeometryClass as RectGeometry,
    CircleGeometryClass as CircleGeometry,
    EllipseGeometryClass as EllipseGeometry,
    PathGeometryClass as PathGeometry,
    PolylineGeometryClass as PolylineGeometry,
    SplineGeometryClass as SplineGeometry,
    BasicMaterialClass as BasicMaterial,
    StrokeMaterialClass as StrokeMaterial,
    GradientMaterialClass as GradientMaterial,
    StrokeGradientMaterialClass as StrokeGradientMaterial,
}
