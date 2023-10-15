/// <reference types="./three.global" />
import globalify from 'utilities/globalify'

import * as module from './three/2index'

globalify({ Three: module.default })

declare global {
    namespace Three {
        function inScene(link: Effects, scene: Three.Scene, object: Three.Object3D): Effect
    }
}

const inScene = effect((resolve, scene: Three.Scene, object: Three.Object3D) => {
    scene.add(object)
    return (): void => scene.remove(object) as never
})

Object.assign(Three, { inScene })
Object.assign(Three.Scene.prototype, {
    has: function (this: Three.Scene, link: Effects, object: Three.Object3D) {
        return inScene(link, this, object)
    },
})
