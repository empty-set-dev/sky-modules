/// <reference types="./three.global" />
import { Object3D, Scene } from 'three/src/Three'

declare global {
    function inScene(link: Effects, scene: Scene, object: Object3D): Effect
}

namespace module {
    export const inScene = effect((resolve, scene: Scene, object: Object3D) => {
        scene.add(object)
        return (): void => {
            scene.remove(object) as never
        }
    })
}

Object.assign(global, module)
Object.assign(Scene.prototype, {
    has: function (this: Scene, link: Effects, object: Object3D) {
        return inScene(link, this, object)
    },
})
