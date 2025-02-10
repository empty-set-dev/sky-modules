import 'sky/features/effect/global'

import * as Three from './_three'

export * from './_three'
export default Three

export function inScene(scene: Three.Scene, object: Three.Object3D, deps: EffectDeps): Effect {
    return new Effect(() => {
        scene.add(object)

        return (): void => {
            scene.remove(object)
        }
    }, deps)
}
