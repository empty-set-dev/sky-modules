import 'imports'
import Three from 'three'

export { default } from 'three'
export * from 'three'

declare global {
    namespace THREE {
        function inScene(link: Effects, scene: Three.Scene, object: Three.Object3D): Effect
    }
}

const inScene = effect((resolve, scene: Three.Scene, object: Three.Object3D) => {
    scene.add(object)
    return (): void => scene.remove(object) as never
})

Object.assign(Three, { inScene })
Object.assign(Three.Scene, { has: inScene })
