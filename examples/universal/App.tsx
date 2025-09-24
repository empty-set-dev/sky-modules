import '#/imports'
import Three from 'pkgs/three'
import { View } from 'react-native'
import useUpdateOnAnimationFrame from 'sky/hooks/useUpdateOnAnimationFrame'

@define('sky.examples.universal.App')
export default class App {
    static context = true

    root = new EffectsRoot()

    @bind
    render = function App(this: App): ReactNode {
        useUpdateOnAnimationFrame()

        return (
            <View
                style={{
                    width: '100%',
                    height: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <div ref={this.initThree} style={{ width: 300, height: 300 }} />
            </View>
        )
    }

    initThree = (element: HTMLDivElement): void => {
        if (element == null) {
            return
        }

        const scene = new Three.Scene()
        const camera = new Three.PerspectiveCamera(75, 1, 0.1, 1000)
        const renderer = new Three.WebGLRenderer()

        renderer.setSize(300, 300)
        element.appendChild(renderer.domElement)

        const geometry = new Three.BufferGeometry()
        const vertices = new Float32Array([-1, -1, 0, 1, -1, 0, 0, 1, 0])
        geometry.setAttribute('position', new Three.BufferAttribute(vertices, 3))

        const material = new Three.MeshBasicMaterial({ color: 0xff0000 })
        const triangle = new Three.Mesh(geometry, material)
        scene.add(triangle)

        camera.position.z = 3

        renderer.render(scene, camera)
    }
}
