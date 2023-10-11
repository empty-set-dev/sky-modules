import 'imports'
import Three from 'three'

export { default } from 'three'
export * from 'three'

export function inScene(link: Effects, object: Three.Object3D, scene: Three.Scene): Effect {
    scene.add(object)

    return atEnd(link, () => scene.remove(object) as never)
}
