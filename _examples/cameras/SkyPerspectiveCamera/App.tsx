import SkyPerspectiveCamera from 'sky/cameras/SkyPerspectiveCamera'
import transformMouseCoordinates from 'sky/helpers/transformMouseCoordinates'
import SkyRenderer from 'sky/renderers/SkyRenderer'

import styles from './App.module.scss'

const cx = cn('[App]', styles)

export default class App extends EffectsRoot {
    static context = true

    renderer: SkyRenderer
    camera: SkyPerspectiveCamera

    constructor() {
        super()

        const renderer = (this.renderer = new SkyRenderer(this, {
            size: (): [number, number] => [window.innerWidth, window.innerHeight],
        }))
        renderer.setClearColor('#2b2b2b', 1.0)

        const canvas = renderer.domElement
        document.querySelector('#root')!.before(canvas)
        cx`canvas` && canvas.classList.add(cx`canvas`)

        const scene = new Three.Scene()

        const sphere = new Three.Mesh(
            new Three.SphereGeometry(1),
            new Three.MeshBasicMaterial({
                color: '#FF0000',
            })
        )

        inScene(sphere, scene, this)

        const camera = (this.camera = new SkyPerspectiveCamera(this))
        const cameraVector = new Vector2(-3, 4)
        let cameraDistanceFactor = 1
        camera.position.y = cameraVector.x
        camera.position.z = cameraVector.y
        camera.lookAt(new Vector3())

        const timer = new Timer()

        new AnimationFrames(() => {
            renderer.render(scene, camera)
            const dt = timer.time()
            this.emit('beforeUpdate', dt)
            this.emit('update', dt)
            this.emit('afterUpdate', dt)
            this.emit('beforeAnimationFrame', dt)
            this.emit('onAnimationFrame', dt)
            this.emit('afterAnimationFrame', dt)
        }, [this])

        new WindowEventListener(
            'mousemove',
            ev => {
                this.__mouse.copy(transformMouseCoordinates(ev))
            },
            this
        )

        new WindowEventListener(
            'wheel',
            ev => {
                cameraDistanceFactor -= ev.deltaY / 100
                cameraDistanceFactor = Math.minmax(cameraDistanceFactor, 0.5, 2)
                camera.position.y = cameraVector.x * cameraDistanceFactor
                camera.position.z = cameraVector.y * cameraDistanceFactor
            },
            this
        )
    }

    View = (): ReactNode => {
        const [, update] = useState(false)
        useAnimationFrames(() => update(v => !v), [])

        return (
            <div className={cx`panel`}>
                <div className={cx`panel-mouse`}>
                    {this.__mouse.x}, {this.__mouse.y}
                </div>
            </div>
        )
    }

    private __mouse = new Vector2()
}
