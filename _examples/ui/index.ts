import '#/client/imports'
import 'sky/cameras/Sky.PerspectiveCamera'
import 'sky/renderers/Sky.Renderer'
import getCameraMouseProjection from 'sky/utilities/getCameraMouseProjection'
import transformMouseCoordinates from 'sky/utilities/transformMouseCoordinates'

import styles from './index.module.scss'

const cx = cn('[index]', styles)
export class App {
    static context: true

    root = new EffectsRoot()
    renderer: Sky.Renderer
    camera: Sky.PerspectiveCamera
    scene: Three.Scene

    constructor() {
        this.root.addContext(this)

        const pixelRatio = window.devicePixelRatio

        const renderer = (this.renderer = new Sky.Renderer(this.root, {
            size: (): [number, number] => [window.innerWidth, window.innerHeight],
            pixelRatio,
        }))
        renderer.setClearColor('#2b2b2b', 0.0)

        const canvas = renderer.domElement
        document.querySelector('#root')!.before(canvas)
        cx`index-canvas` && canvas.classList.add(cx`index-canvas`)

        const camera = (this.camera = new Sky.PerspectiveCamera(this.root, {
            near: (): number => 1,
            far: (): number => 10000,
        }))
        camera.position.z = 1000

        const scene = (this.scene = new Three.Scene())

        this.root
            .registerEmitUpdate(null, () => {
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
            const uiRoot = new UI.Root(this.root)

            const container = new UI.Container(uiRoot.effect)
            inScene(this.scene, container.sprite, [uiRoot.effect, container.effect])

            const button = await new UI.Button(container.effect, {
                text: 'Кнопка!',
                x: 0,
                y: 0,
                click(): void {
                    // eslint-disable-next-line no-console
                    console.log('click!')
                },
            })
            container.add(button.sprite)

            const select = await new UI.Select(container.effect, {
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
            container.add(select.sprite)
        })
    }
}

new App()
