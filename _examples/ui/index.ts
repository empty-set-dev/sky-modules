import '#/imports'
import SkyPerspectiveCamera from 'sky/cameras/SkyPerspectiveCamera'
import getCameraMouseProjection from 'sky/helpers/getCameraMouseProjection'
import transformMouseCoordinates from 'sky/helpers/transformMouseCoordinates'
import SkyRenderer from 'sky/renderers/SkyRenderer'

import styles from './index.module.scss'

const cx = cn('[index]', styles)
export class App extends EffectsRoot {
    renderer: SkyRenderer
    camera: SkyPerspectiveCamera
    scene: Three.Scene

    constructor() {
        super()

        const pixelRatio = window.devicePixelRatio

        const renderer = (this.renderer = new SkyRenderer(this, {
            size: (): [number, number] => [window.innerWidth, window.innerHeight],
            pixelRatio,
        }))
        renderer.setClearColor('#2b2b2b', 0.0)

        const canvas = renderer.domElement
        document.querySelector('#root')!.before(canvas)
        cx`index-canvas` && canvas.classList.add(cx`index-canvas`)

        const camera = (this.camera = new SkyPerspectiveCamera(this))
        camera.position.z = 1000

        const scene = (this.scene = new Three.Scene())

        this.registerEmitUpdate(null, () => {
            renderer.render(scene, camera)
        })
            .registerEmitMouseEvents(mouse => {
                mouse = transformMouseCoordinates(mouse)
                const mouse3 = getCameraMouseProjection(camera, mouse)
                return mouse.copy(mouse3)
            })
            .registerEmitKeyboardEvents()

        //
        until(async () => {
            const uiRoot = new UI.Root(this)

            const container = new UI.Container(uiRoot)
            inScene(this.scene, container.view, [uiRoot, container])

            const button = await new UI.Button(container, {
                text: 'Кнопка!',
                x: 0,
                y: 0,
                click(): void {
                    // eslint-disable-next-line no-console
                    console.log('click!')
                },
            })
            container.add(button)

            const select = await new UI.Select(container, {
                title: 'Select',
                x: 150,
                y: 0,

                options: [
                    {
                        title: 'Option 1',
                        value: 1,
                    },
                    {
                        title: 'Option 2',
                        value: 2,
                    },
                    {
                        title: 'Option 3',
                        value: 3,
                    },
                    {
                        title: 'Option 4',
                        value: 4,
                    },
                    {
                        title: 'Option 5',
                        value: 5,
                    },
                    {
                        title: 'Option 6',
                        value: 6,
                    },
                    {
                        title: 'Option 7',
                        value: 7,
                    },
                    {
                        title: 'Option 8',
                        value: 8,
                    },
                    {
                        title: 'Option 9',
                        value: 9,
                    },
                    {
                        title: 'Option 10',
                        value: 10,
                    },
                    {
                        title: 'Option 11',
                        value: 11,
                    },
                ],
            })
            container.add(select)
        })
    }
}

new App()
