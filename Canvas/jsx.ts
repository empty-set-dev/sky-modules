/* eslint-disable @typescript-eslint/no-explicit-any */
import Canvas from './Canvas'
import { RectGeometry, CircleGeometry, PathGeometry, EllipseGeometry } from './Geometry'
import Group from './Group'
import { StrokeMaterial, GradientMaterial, BasicMaterial } from './Material'
import Mesh from './Mesh'
import Scene from './Scene'

// Canvas JSX types
declare global {
    namespace JSX {
        interface IntrinsicElements {
            // Scene element
            scene: {
                background?: string | CanvasGradient | CanvasPattern
                children?: any
            }

            // Object elements
            mesh: {
                ref?: (mesh: Mesh) => void
                position?: [number, number]
                rotation?: number
                scale?: [number, number]
                visible?: boolean
                onUpdate?: (mesh: Mesh, time: number, delta: number) => void
                children?: any
            }

            group: {
                position?: [number, number]
                rotation?: number
                scale?: [number, number]
                visible?: boolean
                onUpdate?: (group: Group, time: number, delta: number) => void
                children?: any
            }

            // Geometries
            rectGeometry: {
                width?: number
                height?: number
                x?: number
                y?: number
            }

            circleGeometry: {
                radius?: number
                x?: number
                y?: number
                startAngle?: number
                endAngle?: number
                counterclockwise?: boolean
            }

            ellipseGeometry: {
                radiusX?: number
                radiusY?: number
                x?: number
                y?: number
                rotation?: number
                startAngle?: number
                endAngle?: number
                counterclockwise?: boolean
            }

            pathGeometry: {}

            // Materials
            strokeMaterial: {
                color?: string
                lineWidth?: number
                lineCap?: CanvasLineCap
                lineJoin?: CanvasLineJoin
                lineDash?: number[]
                lineDashOffset?: number
                opacity?: number
            }

            gradientMaterial: {
                gradient: CanvasGradient
                opacity?: number
            }

            basicMaterial: {
                color?: string
                opacity?: number
                lineWidth?: number
            }
        }
    }
}

export interface CanvasJSXRendererParameters {
    container?: HTMLElement
    canvas?: HTMLCanvasElement
}
export class CanvasJSXRenderer {
    canvas: Canvas
    scene: Scene

    private frameId: number | null = null
    private clock = { start: Date.now(), lastTime: Date.now() }
    private updateCallbacks = new Map<string, (obj: any, time: number, delta: number) => void>()
    private objects = new Map<string, Mesh | Group>()
    private objectCache = new Map<string, Mesh | Group>()
    private usedKeys = new Set<string>()
    private renderContext: { elementIndex: number; depth: number } = { elementIndex: 0, depth: 0 }

    constructor(parameters?: CanvasJSXRendererParameters) {
        this.canvas = new Canvas({
            size: () => [window.innerWidth * 2, window.innerHeight * 2],
            ...(parameters?.canvas ? { canvas: parameters?.canvas } : null),
        })
        this.scene = new Scene()

        if (parameters && parameters.container) {
            try {
                parameters.container.appendChild(this.canvas.domElement)
            } catch {
                // Ignore appendChild errors in test environment
            }
        }

        this.canvas.onResize()
        this.start()
    }

    // Main render function
    render(element: any | any[]): void {
        // Reset used keys for this render cycle
        this.usedKeys.clear()
        this.updateCallbacks.clear()
        this.renderContext = { elementIndex: 0, depth: 0 }

        // Render new elements
        if (typeof element.type === 'function') {
            element = element.type(element.props)
        }

        if (Array.isArray(element)) {
            element.forEach((el, index) => {
                this.renderContext.elementIndex = index
                this.renderElement(el, this.scene)
            })
        } else {
            this.renderContext.elementIndex = 0
            this.renderElement(element, this.scene)
        }

        // Remove unused objects from scene and cache
        this.cleanupUnusedObjects()

        // Render the scene to canvas
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

        const { type, props } = element

        if (props.children == null) {
            return
        }

        const key = this.generateKey(type, props)

        switch (type) {
            case 'Fragment':
                return this.renderFragment(props, props.children, parent)
            case 'scene':
                return this.renderScene(props, props.children)
            case 'mesh':
                return this.renderMesh(props, props.children, parent, key)
            case 'group':
                return this.renderGroup(props, props.children, parent, key)
            default:
                return null
        }
    }

    private generateKey(type: string | Function, props: Record<string, unknown>): string {
        const typeStr = typeof type === 'string' ? type : type?.name || 'unknown'

        // Create stable key based on props content
        const propKeys = Object.keys(props).filter(
            k => k !== 'children' && k !== 'onUpdate' && k !== 'ref'
        )
        const propHash = propKeys
            .sort()
            .map(k => `${k}:${JSON.stringify(props[k])}`)
            .join('|')

        // Include position context to ensure uniqueness
        return `${typeStr}_${propHash}_${this.renderContext.depth}_${this.renderContext.elementIndex}`
    }

    private renderFragment(props: any, children: any, parent: Scene | Mesh | Group): any {
        children.forEach((child: any) => this.renderElement(child, parent))
        return parent
    }

    private renderScene(props: any, children: any[]): Scene {
        if (props.background !== undefined) {
            this.scene.setBackground(props.background)
        }

        children.forEach(child => this.renderElement(child, this.scene))
        return this.scene
    }

    private renderMesh(
        props: any,
        children: any[],
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

            children.forEach(child => {
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
                geometry = new RectGeometry(100, 100)
            }

            if (!material) {
                material = new BasicMaterial({ color: '#ffffff' })
            }

            mesh = new Mesh(geometry, material)
            if (props.ref) props.ref(mesh)
            this.objectCache.set(key, mesh)
        }

        // Always update ref (it might have changed)
        if (props.ref) {
            props.ref = mesh
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
        children: any[],
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

        children.forEach((child, index) => {
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
        const { type, props } = element

        switch (type) {
            // Geometries
            case 'rectGeometry':
                return new RectGeometry(
                    props.width || 100,
                    props.height || 100,
                    props.x || 0,
                    props.y || 0
                )
            case 'circleGeometry':
                return new CircleGeometry(
                    props.radius || 50,
                    props.x || 0,
                    props.y || 0,
                    props.startAngle || 0,
                    props.endAngle || Math.PI * 2,
                    props.counterclockwise || false
                )
            case 'ellipseGeometry':
                return new EllipseGeometry(
                    props.radiusX || 50,
                    props.radiusY || 30,
                    props.x || 0,
                    props.y || 0,
                    props.rotation || 0,
                    props.startAngle || 0,
                    props.endAngle || Math.PI * 2,
                    props.counterclockwise || false
                )
            case 'pathGeometry':
                return new PathGeometry()

            // Materials
            case 'strokeMaterial':
                return new StrokeMaterial(props)
            case 'gradientMaterial':
                return new GradientMaterial(props)
            case 'basicMaterial':
                return new BasicMaterial(props)

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
        this.stop()
        this.clearScene()
    }
}
