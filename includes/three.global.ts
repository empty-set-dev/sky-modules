/// <reference types="./three.global" />
import { Object3D, Scene } from 'three/src/Three'

declare global {
    function inScene(link: Link, scene: Scene, object: Object3D): Effect
}

namespace module {
    export const inScene = defineEffect((resolve, scene: Scene, object: Object3D) => {
        scene.add(object)
        return (): void => {
            scene.remove(object) as never
        }
    })
}

Object.assign(global, module)
Object.assign(Scene.prototype, {
    has: function (this: Scene, link: Link, object: Object3D) {
        return inScene(link, this, object)
    },
})
