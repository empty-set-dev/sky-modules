import '#/imports'
import { ThreeJSXRenderer } from 'sky/Three/jsx'

import Foo from './components/Foo'

@define('sky.examples.universal.App')
export default class App {
    constructor() {
        // const scene = new Three.Scene()
        // const camera = new Three.PerspectiveCamera(75, 1, 0.1, 1000)
        // const renderer = new Three.WebGLRenderer()

        // renderer.setSize(300, 300)
        // document.body.prepend(renderer.domElement)

        // const geometry = new Three.BufferGeometry()
        // const vertices = new Float32Array([-1, -1, 0, 1, -1, 0, 0, 1, 0])
        // geometry.setAttribute('position', new Three.BufferAttribute(vertices, 3))

        // const material = new Three.MeshBasicMaterial({ color: 0xff0000 })
        // const triangle = new Three.Mesh(geometry, material)
        // scene.add(triangle)

        // camera.position.z = 3

        // renderer.render(scene, camera)

        const renderer = new ThreeJSXRenderer(document.body)
        requestAnimationFrame(frame)
        function frame() {
            requestAnimationFrame(frame)

            renderer.render(Foo())
        }
    }
}
