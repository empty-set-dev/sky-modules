import '#/imports'
import SkyPerspectiveCamera from 'sky/cameras/SkyPerspectiveCamera'
import SkyRenderer from 'sky/renderers/SkyRenderer'

import styles from './index.module.scss'
const cx = cn('[index]', styles)

export class App extends EffectsRoot {
    renderer: SkyRenderer
    camera: SkyPerspectiveCamera
    scene: Three.Scene

    constructor() {
        super()

        const renderer = (this.renderer = new SkyRenderer(this, {
            size: (): [number, number] => [window.innerWidth, window.innerHeight],
        }))
        renderer.setClearColor('#2b2b2b', 1.0)

        const canvas = renderer.domElement
        document.querySelector('#root')!.before(canvas)
        cx`index-canvas` && canvas.classList.add(cx`index-canvas`)

        const camera = (this.camera = new SkyPerspectiveCamera(this))

        camera.position.z = 4

        const scene = (this.scene = new Three.Scene())

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
        }, this)

        //
        const button = new UI.Button(this, {
            text: 'Button',
        })
        inScene(this.scene, button.view, [this, button])
    }
}

new App()
