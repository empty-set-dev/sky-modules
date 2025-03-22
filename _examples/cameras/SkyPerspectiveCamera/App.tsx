import transformMouseCoordinates from 'sky/utilities/transformMouseCoordinates'
import SkyRenderer from 'sky/renderers/SkyRenderer'

import styles from './App.module.scss'
import Camera from './cameras/Camera'
import DirectionalLight from './lights/DirectionalLight'
import SphereView from './views/SphereView'

const cx = cn('[App]', styles)

export default class App extends EffectsRoot {
    static context = true

    renderer: SkyRenderer
    camera: Camera
    scene: Three.Scene

    constructor() {
        super()

        const renderer = (this.renderer = new SkyRenderer(this, {
            size: (): [number, number] => [window.innerWidth, window.innerHeight],
        }))
        renderer.setClearColor('#2b2b2b', 1.0)

        const canvas = renderer.domElement
        document.querySelector('#root')!.before(canvas)
        cx`canvas` && canvas.classList.add(cx`canvas`)

        new SphereView(this)
        new DirectionalLight(this)

        const camera = (this.camera = new Camera(this))

        const scene = (this.scene = new Three.Scene())

        const timer = new Timer()

        new AnimationFrames(() => {
            renderer.render(scene, camera.camera)
            const dt = timer.time()

            this.emit('beforeUpdate', dt)
            this.emit('update', dt)
            this.emit('afterUpdate', dt)
            this.emit('beforeAnimationFrame', dt)
            this.emit('onAnimationFrame', dt)
            this.emit('afterAnimationFrame', dt)
        }, this)

        new WindowEventListener(
            'mousemove',
            ev => {
                this.__mouse.copy(transformMouseCoordinates(ev))
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
                    Mouse: {this.__mouse.x.toFixed(2)}, {this.__mouse.y.toFixed(2)}
                </div>
            </div>
        )
    }

    private __mouse = new Vector2()
}
