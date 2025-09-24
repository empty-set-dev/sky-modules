// jsx-runtime.ts - Custom JSX Runtime для Three.js
import * as THREE from 'three'

// Типы для Three.js JSX элементов
declare global {
    namespace JSX {
        interface IntrinsicElements {
            // Scene elements
            scene: {
                background?: string | number
                fog?: { color?: string | number; near?: number; far?: number }
                children?: JSX.Node
            }

            // Camera
            camera: {
                position?: [number, number, number]
                rotation?: [number, number, number]
                fov?: number
                aspect?: number
                near?: number
                far?: number
                lookAt?: [number, number, number]
            }

            // Lights
            ambientLight: {
                color?: string | number
                intensity?: number
            }

            directionalLight: {
                color?: string | number
                intensity?: number
                position?: [number, number, number]
                castShadow?: boolean
            }

            pointLight: {
                color?: string | number
                intensity?: number
                position?: [number, number, number]
                distance?: number
                decay?: number
            }

            spotLight: {
                color?: string | number
                intensity?: number
                position?: [number, number, number]
                target?: [number, number, number]
                angle?: number
                penumbra?: number
                decay?: number
                distance?: number
            }

            // Mesh
            mesh: {
                position?: [number, number, number]
                rotation?: [number, number, number]
                scale?: [number, number, number]
                castShadow?: boolean
                receiveShadow?: boolean
                visible?: boolean
                userData?: any
                onUpdate?: (mesh: THREE.Mesh, time: number, delta: number) => void
                children?: any
            }

            // Group
            group: {
                position?: [number, number, number]
                rotation?: [number, number, number]
                scale?: [number, number, number]
                visible?: boolean
                children?: any
            }

            // Geometries
            boxGeometry: {
                args?: [number?, number?, number?, number?, number?, number?]
            }

            sphereGeometry: {
                args?: [number?, number?, number?, number?, number?, number?]
            }

            cylinderGeometry: {
                args?: [number?, number?, number?, number?, number?, boolean?, number?, number?]
            }

            planeGeometry: {
                args?: [number?, number?, number?, number?]
            }

            coneGeometry: {
                args?: [number?, number?, number?, number?, boolean?, number?, number?]
            }

            torusGeometry: {
                args?: [number?, number?, number?, number?, number?]
            }

            // Materials
            meshBasicMaterial: {
                color?: string | number
                opacity?: number
                transparent?: boolean
                wireframe?: boolean
                side?: THREE.Side
            }

            meshStandardMaterial: {
                color?: string | number
                opacity?: number
                transparent?: boolean
                wireframe?: boolean
                metalness?: number
                roughness?: number
                emissive?: string | number
                emissiveIntensity?: number
                side?: THREE.Side
            }

            meshPhongMaterial: {
                color?: string | number
                opacity?: number
                transparent?: boolean
                wireframe?: boolean
                shininess?: number
                specular?: string | number
                side?: THREE.Side
            }

            meshPhysicalMaterial: {
                color?: string | number
                opacity?: number
                transparent?: boolean
                wireframe?: boolean
                metalness?: number
                roughness?: number
                clearcoat?: number
                clearcoatRoughness?: number
                transmission?: number
                thickness?: number
                ior?: number
                side?: THREE.Side
            }

            // Lines
            line: {
                points?: Array<[number, number, number]>
                color?: string | number
                linewidth?: number
            }

            lineLoop: {
                points?: Array<[number, number, number]>
                color?: string | number
                linewidth?: number
            }

            lineSegments: {
                points?: Array<[number, number, number]>
                color?: string | number
                linewidth?: number
            }

            gridHelper: {}
        }
    }
}

// Three.js JSX Renderer
export class ThreeJSXRenderer {
    public scene: THREE.Scene
    public camera: THREE.PerspectiveCamera
    public renderer: THREE.WebGLRenderer
    public clock: THREE.Clock

    private objects = new Map<string, THREE.Object3D>()
    private updateCallbacks = new Map<string, (obj: unknown, time: number, delta: number) => void>()
    private frameId: number | null = null

    constructor(container?: HTMLElement) {
        this.scene = new THREE.Scene()
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        )
        this.renderer = new THREE.WebGLRenderer({ antialias: true })
        this.clock = new THREE.Clock()

        this.init(container)
        this.start()
    }

    private init(container: HTMLElement = document.body): void {
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        this.renderer.setClearColor(0x111111)
        this.renderer.shadowMap.enabled = true
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap

        container.appendChild(this.renderer.domElement)

        // Default camera setup
        this.camera.position.set(5, 5, 5)
        this.camera.lookAt(0, 0, 0)

        this.setupControls()
        window.addEventListener('resize', this.handleResize.bind(this))
    }

    private setupControls(): void {
        let isMouseDown = false
        let mouseX = 0,
            mouseY = 0

        this.renderer.domElement.addEventListener('mousedown', event => {
            isMouseDown = true
            mouseX = event.clientX
            mouseY = event.clientY
        })

        document.addEventListener('mouseup', () => {
            isMouseDown = false
        })

        document.addEventListener('mousemove', event => {
            if (!isMouseDown) return

            const deltaX = event.clientX - mouseX
            const deltaY = event.clientY - mouseY

            const spherical = new THREE.Spherical()
            spherical.setFromVector3(this.camera.position)
            spherical.theta -= deltaX * 0.01
            spherical.phi += deltaY * 0.01
            spherical.phi = Math.max(0.1, Math.min(Math.PI - 0.1, spherical.phi))

            this.camera.position.setFromSpherical(spherical)
            this.camera.lookAt(0, 0, 0)

            mouseX = event.clientX
            mouseY = event.clientY
        })

        this.renderer.domElement.addEventListener('wheel', event => {
            event.preventDefault()
            const scale = event.deltaY > 0 ? 1.1 : 0.9
            this.camera.position.multiplyScalar(scale)
        })
    }

    private handleResize(): void {
        this.camera.aspect = window.innerWidth / window.innerHeight
        this.camera.updateProjectionMatrix()
        this.renderer.setSize(window.innerWidth, window.innerHeight)
    }

    // Main render function
    render(element: JSX.Element | JSX.Element[]) {
        // Clear previous frame
        this.clearScene()
        this.updateCallbacks.clear()

        // Render new elements
        if (Array.isArray(element)) {
            element.forEach(el => this.renderElement(el, this.scene))
        } else {
            this.renderElement(element, this.scene)
        }
    }

    private clearScene() {
        const objectsToRemove: THREE.Object3D[] = []
        this.scene.traverse(child => {
            if (child !== this.scene && !child.isLight) {
                objectsToRemove.push(child)
            }
        })

        objectsToRemove.forEach(obj => {
            this.scene.remove(obj)
            if ('geometry' in obj && obj.geometry) {
                ;(obj.geometry as THREE.BufferGeometry).dispose()
            }
            if ('material' in obj && obj.material) {
                const material = obj.material as THREE.Material | THREE.Material[]
                if (Array.isArray(material)) {
                    material.forEach(mat => mat.dispose())
                } else {
                    material.dispose()
                }
            }
        })
    }

    private renderElement(element: JSX.Element, parent: THREE.Object3D): THREE.Object3D | null {
        if (!element) return null

        const { type, props, children } = element
        const key = this.generateKey(type, props)

        switch (type) {
            case 'Fragment':
                return this.renderFragment(props, children)
            case 'scene':
                return this.renderScene(props, children)
            case 'camera':
                return this.renderCamera(props)
            case 'ambientLight':
                return this.renderAmbientLight(props, parent, key)
            case 'directionalLight':
                return this.renderDirectionalLight(props, parent, key)
            case 'pointLight':
                return this.renderPointLight(props, parent, key)
            case 'spotLight':
                return this.renderSpotLight(props, parent, key)
            case 'mesh':
                return this.renderMesh(props, children, parent, key)
            case 'group':
                return this.renderGroup(props, children, parent, key)
            case 'line':
                return this.renderLine(props, parent, key)
            case 'lineLoop':
                return this.renderLineLoop(props, parent, key)
            case 'lineSegments':
                return this.renderLineSegments(props, parent, key)
            case 'gridHelper':
                return this.renderGridHelper(props, parent, key)
            default:
                return null
        }
    }

    private generateKey(type: string | Function, props: any): string {
        const typeStr = typeof type === 'string' ? type : type.name
        const propsStr = JSON.stringify(props)
        return `${typeStr}_${btoa(propsStr).slice(0, 8)}_${Date.now()}`
    }

    private renderFragment(props: any, children: JSX.Node): THREE.Scene {
        children.forEach(child => this.renderElement(child, this.scene))
        return this.scene
    }

    private renderScene(props: any, children: JSX.Element[]): THREE.Scene {
        if (props.background !== undefined) {
            this.scene.background = new THREE.Color(props.background)
        }

        if (props.fog) {
            const { color = 0xcccccc, near = 1, far = 1000 } = props.fog
            this.scene.fog = new THREE.Fog(color, near, far)
        }

        children.forEach(child => this.renderElement(child, this.scene))
        return this.scene
    }

    private renderCamera(props: any): THREE.PerspectiveCamera {
        const { position, rotation, fov, aspect, near, far, lookAt } = props

        if (fov !== undefined) this.camera.fov = fov
        if (aspect !== undefined) this.camera.aspect = aspect
        if (near !== undefined) this.camera.near = near
        if (far !== undefined) this.camera.far = far

        if (position) this.camera.position.set(...position)
        if (rotation) this.camera.rotation.set(...rotation)
        if (lookAt) this.camera.lookAt(...lookAt)

        this.camera.updateProjectionMatrix()
        return this.camera
    }

    private renderAmbientLight(
        props: any,
        parent: THREE.Object3D,
        key: string
    ): THREE.AmbientLight {
        const { color = 0xffffff, intensity = 1 } = props

        const light = new THREE.AmbientLight(color, intensity)
        parent.add(light)
        this.objects.set(key, light)

        return light
    }

    private renderDirectionalLight(
        props: any,
        parent: THREE.Object3D,
        key: string
    ): THREE.DirectionalLight {
        const { color = 0xffffff, intensity = 1, position = [0, 1, 0], castShadow = false } = props

        const light = new THREE.DirectionalLight(color, intensity)
        light.position.set(...position)
        light.castShadow = castShadow

        if (castShadow) {
            light.shadow.mapSize.width = 2048
            light.shadow.mapSize.height = 2048
        }

        parent.add(light)
        this.objects.set(key, light)

        return light
    }

    private renderPointLight(props: any, parent: THREE.Object3D, key: string): THREE.PointLight {
        const {
            color = 0xffffff,
            intensity = 1,
            position = [0, 0, 0],
            distance = 0,
            decay = 2,
        } = props

        const light = new THREE.PointLight(color, intensity, distance, decay)
        light.position.set(...position)

        parent.add(light)
        this.objects.set(key, light)

        return light
    }

    private renderSpotLight(props: any, parent: THREE.Object3D, key: string): THREE.SpotLight {
        const {
            color = 0xffffff,
            intensity = 1,
            position = [0, 0, 0],
            target = [0, 0, 0],
            angle = Math.PI / 3,
            penumbra = 0,
            decay = 2,
            distance = 0,
        } = props

        const light = new THREE.SpotLight(color, intensity, distance, angle, penumbra, decay)
        light.position.set(...position)
        light.target.position.set(...target)

        parent.add(light)
        parent.add(light.target)
        this.objects.set(key, light)

        return light
    }

    private renderMesh(
        props: any,
        children: JSXElement[],
        parent: THREE.Object3D,
        key: string
    ): THREE.Mesh {
        const mesh = new THREE.Mesh()

        // Set transform properties
        if (props.position) mesh.position.set(...props.position)
        if (props.rotation) mesh.rotation.set(...props.rotation)
        if (props.scale) mesh.scale.set(...props.scale)
        if (props.visible !== undefined) mesh.visible = props.visible
        if (props.castShadow !== undefined) mesh.castShadow = props.castShadow
        if (props.receiveShadow !== undefined) mesh.receiveShadow = props.receiveShadow
        if (props.userData) mesh.userData = props.userData

        // Process children for geometry and material
        children.forEach(child => {
            const obj = this.createGeometryOrMaterial(child)
            if (obj) {
                if ('isBufferGeometry' in obj) {
                    mesh.geometry = obj as THREE.BufferGeometry
                } else if ('isMaterial' in obj) {
                    mesh.material = obj as THREE.Material
                }
            }
        })

        // Add update callback
        if (props.onUpdate) {
            this.updateCallbacks.set(key, props.onUpdate)
        }

        parent.add(mesh)
        this.objects.set(key, mesh)

        return mesh
    }

    private renderGroup(
        props: any,
        children: JSXElement[],
        parent: THREE.Object3D,
        key: string
    ): THREE.Group {
        const group = new THREE.Group()

        if (props.position) group.position.set(...props.position)
        if (props.rotation) group.rotation.set(...props.rotation)
        if (props.scale) group.scale.set(...props.scale)
        if (props.visible !== undefined) group.visible = props.visible

        children.forEach(child => this.renderElement(child, group))

        parent.add(group)
        this.objects.set(key, group)

        return group
    }

    private renderLine(props: any, parent: THREE.Object3D, key: string): THREE.Line {
        const { points = [], color = 0xffffff, linewidth = 1 } = props

        const geometry = new THREE.BufferGeometry().setFromPoints(
            points.map((p: [number, number, number]) => new THREE.Vector3(...p))
        )
        const material = new THREE.LineBasicMaterial({ color, linewidth })
        const line = new THREE.Line(geometry, material)

        parent.add(line)
        this.objects.set(key, line)

        return line
    }

    private renderLineLoop(props: any, parent: THREE.Object3D, key: string): THREE.LineLoop {
        const { points = [], color = 0xffffff, linewidth = 1 } = props

        const geometry = new THREE.BufferGeometry().setFromPoints(
            points.map((p: [number, number, number]) => new THREE.Vector3(...p))
        )
        const material = new THREE.LineBasicMaterial({ color, linewidth })
        const line = new THREE.LineLoop(geometry, material)

        parent.add(line)
        this.objects.set(key, line)

        return line
    }

    private renderLineSegments(
        props: any,
        parent: THREE.Object3D,
        key: string
    ): THREE.LineSegments {
        const { points = [], color = 0xffffff, linewidth = 1 } = props

        const geometry = new THREE.BufferGeometry().setFromPoints(
            points.map((p: [number, number, number]) => new THREE.Vector3(...p))
        )
        const material = new THREE.LineBasicMaterial({ color, linewidth })
        const line = new THREE.LineSegments(geometry, material)

        parent.add(line)
        this.objects.set(key, line)

        return line
    }

    private createGeometryOrMaterial(
        element: JSXElement
    ): THREE.BufferGeometry | THREE.Material | null {
        const { type, props } = element

        switch (type) {
            // Geometries
            case 'boxGeometry':
                return new THREE.BoxGeometry(...(props.args || [1, 1, 1]))
            case 'sphereGeometry':
                return new THREE.SphereGeometry(...(props.args || [1, 8, 6]))
            case 'cylinderGeometry':
                return new THREE.CylinderGeometry(...(props.args || [1, 1, 1, 8]))
            case 'planeGeometry':
                return new THREE.PlaneGeometry(...(props.args || [1, 1]))
            case 'coneGeometry':
                return new THREE.ConeGeometry(...(props.args || [1, 1, 8]))
            case 'torusGeometry':
                return new THREE.TorusGeometry(...(props.args || [1, 0.4, 8, 16]))

            // Materials
            case 'meshBasicMaterial':
                return new THREE.MeshBasicMaterial(props)
            case 'meshStandardMaterial':
                return new THREE.MeshStandardMaterial(props)
            case 'meshPhongMaterial':
                return new THREE.MeshPhongMaterial(props)
            case 'meshPhysicalMaterial':
                return new THREE.MeshPhysicalMaterial(props)

            default:
                return null
        }
    }

    private renderGridHelper(props: any, parent: THREE.Object3D, key: string): THREE.Line { 
        const gridHelper = new THREE.GridHelper(10, 10, 0x440000, 0x004400)

        parent.add(gridHelper)
        this.objects.set(key, gridHelper)

        return gridHelper
    }

    private animate = () => {
        this.frameId = requestAnimationFrame(this.animate)

        const time = this.clock.getElapsedTime()
        const delta = this.clock.getDelta()

        // Execute update callbacks
        this.updateCallbacks.forEach((callback, key) => {
            const obj = this.objects.get(key)
            if (obj && callback) {
                callback(obj, time, delta)
            }
        })

        this.renderer.render(this.scene, this.camera)
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
        this.clearScene()
        this.renderer.dispose()
    }
}
