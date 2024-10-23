import 'sky/features/effect/global'

import * as Three from './_three.d'

export * from './_three.d'
export default Three

export function inScene(object: Three.Object3D, scene: Three.Scene, deps: EffectDeps): Effect {
    return new Effect(() => {
        scene.add(object)

        return (): void => {
            scene.remove(object)
        }
    }, deps)
}
