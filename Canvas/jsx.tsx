/* eslint-disable @typescript-eslint/no-explicit-any */
import { notUndefined } from '@sky-modules/core/not'
import JSX from 'sky-jsx'
import { createContext, createRoot, useContext, createSignal, createEffect } from 'solid-js'

import Canvas from './Canvas'
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
import GroupClass from './Group'
import {
    StrokeMaterial as StrokeMaterialClass,
    GradientMaterial as GradientMaterialClass,
    StrokeGradientMaterial as StrokeGradientMaterialClass,
    BasicMaterial as BasicMaterialClass,
} from './materials'
import MeshClass from './Mesh'
import SceneClass from './Scene'

// Component Props Types
export interface SceneProps {
    background?: string | CanvasGradient | CanvasPattern
    children?: any
}

export interface MeshProps {
    ref?: (mesh: MeshClass) => void
    position?: [number, number]
    rotation?: number
    scale?: [number, number]
    visible?: boolean
    onUpdate?: (mesh: MeshClass, time: number, delta: number) => void
    children?: any
}

export interface GroupProps {
    position?: [number, number]
    rotation?: number
    scale?: [number, number]
    visible?: boolean
    onUpdate?: (group: GroupClass, time: number, delta: number) => void
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
}
export class CanvasJSXRenderer {
    canvas: Canvas
    scene: SceneClass

    private frameId: number | null = null
    private clock = { start: Date.now(), lastTime: Date.now() }
    private updateCallbacks = new Map<string, (obj: any, time: number, delta: number) => void>()
    private objects = new Map<string, MeshClass | GroupClass>()
    private objectCache = new Map<string, MeshClass | GroupClass>()
    private usedKeys = new Set<string>()
    private renderContext: { elementIndex: number; depth: number } = { elementIndex: 0, depth: 0 }
    private solidDisposer: (() => void) | null = null
    private currentElement: any = null
    private solidRenderTrigger: ((fn: (prev: number) => number) => void) | null = null
    private keyCounters = new Map<string, number>()
    private solidRoots: Map<string, { result: any; dispose: () => void }> = new Map()

    constructor(parameters?: CanvasJSXRendererParameters) {
        this.canvas = new Canvas({
            size: () => [400, 400],
            ...(parameters?.canvas ? { canvas: parameters?.canvas } : null),
        })
        this.scene = new SceneClass()

        // Set global canvas for useCanvas hook
        currentCanvas = this.canvas

        if (parameters?.container) {
            parameters.container.appendChild(this.canvas.domElement)
        }

        this.canvas.onResize()
        this.start()
        this.initSolidRoot()
    }

    private initSolidRoot(): void {
        // Create stable Solid root
        this.solidDisposer = createRoot(dispose => {
            const [getTrigger, setTrigger] = createSignal(0)
            this.solidRenderTrigger = setTrigger

            // Create a reactive effect that will re-run when triggered
            createEffect(() => {
                getTrigger() // Subscribe to trigger
                this.canvas.render(this.scene)
            })

            return dispose
        })
    }

    // Main render function
    render(element: any | any[]): void {
        if (element === null || element === undefined) {
            throw new Error('Cannot render null or undefined element')
        }

        // Store element and trigger Solid re-render only once
        if (!this.currentElement) {
            this.currentElement = element

            if (this.solidRenderTrigger) {
                this.solidRenderTrigger((prev: number) => prev + 1)
            }
        } else {
            this.currentElement = element
        }

        // Also render Canvas objects imperatively in parallel
        this.renderDirectly()
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

        // Remove unused Solid roots and dispose them properly
        for (const [key, cached] of this.solidRoots) {
            if (!this.usedKeys.has(`solid_${key}`)) {
                // Call dispose to trigger onCleanup
                cached.dispose()
                this.solidRoots.delete(key)
            }
        }
    }

    private renderElement(element: any, parent: SceneClass | MeshClass | GroupClass): any {
        if (!element) return null

        let { type, props = {} } = element

        // Handle function components
        if (typeof type === 'function') {
            if (type.builtin) {
                const result = type(props)
                return this.renderElement(result, parent)
            } else {
                // For Solid function components, use cached createRoot
                const funcKey = this.generateKey(type, props)
                this.usedKeys.add(`solid_${funcKey}`)

                if (!this.solidRoots.has(funcKey)) {
                    let result: any = null
                    const dispose = createRoot(dispose => {
                        result = type(props)
                        return dispose
                    })
                    this.solidRoots.set(funcKey, { result, dispose })
                }

                const cached = this.solidRoots.get(funcKey)
                return this.renderElement(cached?.result, parent)
            }
        }

        // Allow elements without children for some types
        if (props.children == null && type !== 'Scene' && type !== 'Mesh' && type !== 'Group') {
            return
        }

        const key = this.generateKey(type, props)

        switch (type) {
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
        parent: SceneClass | MeshClass | GroupClass
    ): any {
        children.forEach((child: any) => this.renderElement(child, parent))
        return parent
    }

    private renderScene(props: any, children: any): SceneClass {
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
        parent: SceneClass | MeshClass | GroupClass,
        key: string
    ): MeshClass {
        // Mark this key as used
        this.usedKeys.add(key)

        // Check if we have a cached mesh for this key
        let mesh = this.objectCache.get(key) as MeshClass

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
                geometry = new RectGeometryClass(100, 100)
            }

            if (!material) {
                material = new BasicMaterialClass({ color: '#ffffff' })
            }

            mesh = new MeshClass(geometry, material)
            if (props.ref) props.ref(mesh)
            this.objectCache.set(key, mesh)
        }

        // Always update ref (it might have changed)
        if (props.ref) {
            props.ref(mesh)
        }

        // Set transform properties
        if (props.position) mesh.position.set(props.position[0], props.position[1])
        if (props.rotation !== undefined) mesh.rotation = props.rotation
        if (props.scale) mesh.scale.set(props.scale[0], props.scale[1])
        if (props.visible !== undefined) mesh.visible = props.visible

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
        parent: SceneClass | MeshClass | GroupClass,
        key: string
    ): GroupClass {
        // Mark this key as used
        this.usedKeys.add(key)

        // Check if we have a cached group for this key
        let group = this.objectCache.get(key) as GroupClass

        if (!group) {
            group = new GroupClass()
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
        let { type, props } = element

        // Handle function components
        if (typeof type === 'function') {
            const resolved = type(props)
            return this.createGeometryOrMaterial(resolved)
        }

        switch (type) {
            // Geometries
            case 'RectGeometry':
                return new RectGeometryClass(
                    props.width || 100,
                    props.height || 100,
                    props.x || 0,
                    props.y || 0
                )
            case 'CircleGeometry':
                return new CircleGeometryClass(
                    props.radius || 50,
                    props.x || 0,
                    props.y || 0,
                    props.startAngle || 0,
                    props.endAngle || Math.PI * 2,
                    props.counterclockwise || false
                )
            case 'EllipseGeometry':
                return new EllipseGeometryClass(
                    props.radiusX || 50,
                    props.radiusY || 30,
                    props.x || 0,
                    props.y || 0,
                    props.rotation || 0,
                    props.startAngle || 0,
                    props.endAngle || Math.PI * 2,
                    props.counterclockwise || false
                )
            case 'PathGeometry':
                return new PathGeometryClass()
            case 'PolylineGeometry':
                return new PolylineGeometryClass(props.points || [], props.closed ?? true)
            case 'SplineGeometry':
                return new SplineGeometryClass(
                    props.points || [],
                    props.type || 'smooth',
                    props.tension ?? 0.5,
                    props.closed ?? true
                )

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

        // Execute update callbacks
        this.updateCallbacks.forEach((callback, key) => {
            const obj = this.objects.get(key)

            if (obj && callback) {
                callback(obj, time, delta)
            }
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
        // Dispose main Solid root
        if (this.solidDisposer) {
            this.solidDisposer()
            this.solidDisposer = null
        }

        // Dispose all cached Solid roots
        for (const [, cached] of this.solidRoots) {
            cached.dispose()
        }

        this.solidRoots.clear()

        this.stop()
        this.clearScene()
    }
}

const CanvasContext = createContext<Canvas | undefined>()

// Global canvas instance for current renderer
let currentCanvas: Canvas | undefined = undefined

export function useCanvas(): Canvas {
    const contextCanvas = useContext(CanvasContext)
    return notUndefined(contextCanvas || currentCanvas, 'canvas context')
}

// Component Functions with capitalized names
export function Scene(props: SceneProps): JSX.Element {
    return {
        type: 'Scene',
        props,
        key: '',
    }
}
Scene.builtin = true

export function Mesh(props: MeshProps): JSX.Element {
    return {
        type: 'Mesh',
        props,
        key: '',
    }
}
Mesh.builtin = true

export function Group(props: GroupProps): JSX.Element {
    return {
        type: 'Group',
        props,
        key: '',
    }
}
Group.builtin = true

// Geometry Components
export function RectGeometry(props: RectGeometryProps): JSX.Element {
    return {
        type: 'RectGeometry',
        props,
        key: '',
    }
}
RectGeometry.builtin = true

export function CircleGeometry(props: CircleGeometryProps): JSX.Element {
    return {
        type: 'CircleGeometry',
        props,
        key: '',
    }
}
CircleGeometry.builtin = true

export function EllipseGeometry(props: EllipseGeometryProps): JSX.Element {
    return {
        type: 'EllipseGeometry',
        props,
        key: '',
    }
}
EllipseGeometry.builtin = true

export function PathGeometry(props: PathGeometryProps): JSX.Element {
    return {
        type: 'PathGeometry',
        props,
        key: '',
    }
}
PathGeometry.builtin = true

export function PolylineGeometry(props: PolylineGeometryProps): JSX.Element {
    return {
        type: 'PolylineGeometry',
        props,
        key: '',
    }
}
PolylineGeometry.builtin = true

export function SplineGeometry(props: SplineGeometryProps): JSX.Element {
    return {
        type: 'SplineGeometry',
        props,
        key: '',
    }
}
SplineGeometry.builtin = true

// Material Components
export function StrokeMaterial(props: StrokeMaterialProps): JSX.Element {
    return {
        type: 'StrokeMaterial',
        props,
        key: '',
    }
}
StrokeMaterial.builtin = true

export function GradientMaterial(props: GradientMaterialProps): JSX.Element {
    return {
        type: 'GradientMaterial',
        props,
        key: '',
    }
}
GradientMaterial.builtin = true

export function StrokeGradientMaterial(props: StrokeGradientMaterialProps): JSX.Element {
    return {
        type: 'StrokeGradientMaterial',
        props,
        key: '',
    }
}
StrokeGradientMaterial.builtin = true

export function BasicMaterial(props: BasicMaterialProps): JSX.Element {
    return {
        type: 'BasicMaterial',
        props,
        key: '',
    }
}
BasicMaterial.builtin = true
