import { effect, onFrame } from '@sky-modules/behavior/reactive'
import EffectDep from '@sky-modules/features/effect/EffectDep'
import Vector2 from '@sky-modules/math/Vector2'
import JSX from 'sky-jsx'

import Canvas from '../Canvas'
import { RectGeometry, CircleGeometry, EllipseGeometry } from '../Geometry'
import Group from '../Group'
import { BasicMaterial, StrokeMaterial, FillStrokeMaterial } from '../Material'
import Mesh from '../Mesh'
import Scene from '../Scene'

// Canvas renderer for pure JSX
export default class CanvasRenderer {
    private canvas: Canvas | null = null
    private scene: Scene | null = null
    private dep: EffectDep | null = null
    private mounted = false
    private objectMap = new Map<JSX.Node, any>()

    render(vnode: JSX.Node, container?: HTMLElement): Canvas | null {
        if (vnode.type !== 'canvas') {
            throw new Error('Root element must be <canvas>')
        }

        return this.renderCanvas(vnode, container)
    }

    private renderCanvas(vnode: VNode, container?: HTMLElement): Canvas {
        const props = vnode.props

        if (!this.canvas) {
            this.dep = props.dep
            this.canvas = new Canvas(props.dep, {
                size: props.size || (() => [800, 600]),
                pixelRatio: props.pixelRatio || window.devicePixelRatio,
            })

            this.scene = new Scene(props.dep)

            if (container) {
                container.appendChild(this.canvas.domElement)
            }

            this.startRenderLoop()
            props.onCreated?.(this.canvas)
        }

        // Render children
        this.renderChildren(vnode.children)

        return this.canvas
    }

    private renderChildren(children: VNode[]): void {
        children.forEach(child => this.renderNode(child))
    }

    private renderNode(vnode: VNode): any {
        if (typeof vnode.type === 'function') {
            // Component function
            const result = vnode.type(vnode.props)

            if (Array.isArray(result)) {
                result.forEach(child => this.renderNode(child))
            } else if (result) {
                return this.renderNode(result)
            }

            return null
        }

        switch (vnode.type) {
            case 'scene':
                return this.renderScene(vnode)
            case 'mesh':
                return this.renderMesh(vnode)
            case 'group':
                return this.renderGroup(vnode)
            case 'rect':
                return this.createRectGeometry(vnode.props)
            case 'circle':
                return this.createCircleGeometry(vnode.props)
            case 'fill':
                return this.createBasicMaterial(vnode.props)
            case 'stroke':
                return this.createStrokeMaterial(vnode.props)
            default:
                console.warn(`Unknown element type: ${vnode.type}`)
                return null
        }
    }

    private renderScene(vnode: VNode): Scene {
        if (!this.scene) return null as any

        const props = vnode.props

        if (props.background) {
            this.scene.setBackground(props.background)
        }

        this.applyObjectProps(this.scene, props)
        this.renderChildren(vnode.children)

        return this.scene
    }

    private renderMesh(vnode: VNode): Mesh {
        const props = vnode.props
        let geometry: any = null
        let material: any = null

        // Find geometry and material in children
        vnode.children.forEach(child => {
            const rendered = this.renderNode(child)

            if (rendered) {
                if (rendered.draw && typeof rendered.draw === 'function') {
                    geometry = rendered
                } else if (rendered.render && typeof rendered.render === 'function') {
                    material = rendered
                }
            }
        })

        if (!geometry || !material) {
            console.warn('Mesh requires both geometry and material')
            return null as any
        }

        const mesh = new Mesh(this.dep!, geometry, material)
        this.applyObjectProps(mesh, props)

        // Store in object map
        this.objectMap.set(vnode, mesh)

        // Add to parent (scene or group)
        if (this.scene) {
            this.scene.add(mesh)
        }

        return mesh
    }

    private renderGroup(vnode: VNode): Group {
        const props = vnode.props
        const group = new Group(this.dep!)

        this.applyObjectProps(group, props)

        // Store in object map
        this.objectMap.set(vnode, group)

        // Render children and add to group
        vnode.children.forEach(child => {
            const rendered = this.renderNode(child)

            if (rendered && rendered.add) {
                group.add(rendered)
            }
        })

        // Add to parent
        if (this.scene) {
            this.scene.add(group)
        }

        return group
    }

    private createRectGeometry(props: any): RectGeometry {
        return new RectGeometry(props.width || 100, props.height || 100, props.x || 0, props.y || 0)
    }

    private createCircleGeometry(props: any): CircleGeometry {
        return new CircleGeometry(
            props.radius || 50,
            props.x || 0,
            props.y || 0,
            props.startAngle || 0,
            props.endAngle || Math.PI * 2,
            props.counterclockwise || false
        )
    }

    private createBasicMaterial(props: any): BasicMaterial {
        return new BasicMaterial({
            color: props.color || '#ffffff',
            opacity: props.opacity || 1,
        })
    }

    private createStrokeMaterial(props: any): StrokeMaterial {
        return new StrokeMaterial({
            color: props.color || '#000000',
            lineWidth: props.lineWidth || 1,
            opacity: props.opacity || 1,
        })
    }

    private applyObjectProps(object: any, props: any): void {
        if (props.position) {
            if (Array.isArray(props.position)) {
                object.setPosition(props.position[0], props.position[1])
            } else {
                object.setPosition(props.position.x || 0, props.position.y || 0)
            }
        }

        if (props.rotation !== undefined) {
            object.setRotation(props.rotation)
        }

        if (props.scale !== undefined) {
            if (typeof props.scale === 'number') {
                object.setScale(props.scale, props.scale)
            } else if (Array.isArray(props.scale)) {
                object.setScale(props.scale[0], props.scale[1])
            } else {
                object.setScale(props.scale.x || 1, props.scale.y || 1)
            }
        }

        if (props.visible !== undefined) {
            object.setVisible(props.visible)
        }

        if (props.name) {
            object.name = props.name
        }

        if (props.id) {
            object.id = props.id
        }
    }

    private startRenderLoop(): void {
        if (this.mounted) return

        this.mounted = true

        onFrame(() => {
            if (this.canvas && this.scene) {
                // Update canvas size if needed
                this.canvas.onResize()

                // Render scene
                this.canvas.render(this.scene)
            }
        })
    }

    destroy(): void {
        this.mounted = false
        this.objectMap.clear()

        if (this.canvas && this.canvas.domElement.parentNode) {
            this.canvas.domElement.parentNode.removeChild(this.canvas.domElement)
        }

        this.canvas = null
        this.scene = null
        this.dep = null
    }
}

// Global renderer instance
export const renderer = new CanvasRenderer()

// Main render function
export function render(vnode: JSX.Node, container?: HTMLElement): Canvas | null {
    return renderer.render(vnode, container)
}

// Component helper
export function component<P = any>(
    fn: (props: P) => JSX.Node | JSX.Node[] | null
): (props: P) => JSX.Node | JSX.Node[] | null {
    return fn
}
