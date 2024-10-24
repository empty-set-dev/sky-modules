import SkyPerspectiveCamera from 'sky/cameras/SkyPerspectiveCamera'
import SkyRenderer from 'sky/renderers/SkyRenderer'

import styles from './App.module.scss'

const cx = cn('[App]', styles)

export default class App extends EffectsRoot {
    static context = true

    renderer: SkyRenderer

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

        const camera = new SkyPerspectiveCamera(this)
        camera.position.y = -3
        camera.position.z = 4
        camera.lookAt(new Vector3())

        new AnimationFrames(() => {
            this.renderer.render(scene, camera)
        }, this)
    }

    View(): ReactNode {
        return <div className={cx`e:panel`}></div>
    }
}
