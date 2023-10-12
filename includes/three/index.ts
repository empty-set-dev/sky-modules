import * as Three from '../../node_modules/three'
export default Three

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
Object.assign(Three.Scene, { has: inScene })
