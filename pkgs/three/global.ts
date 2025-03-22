import globalify from 'sky/utilities/globalify'

import * as pkg from '.'

declare global {
    type Three = void

    function inScene(scene: Three.Scene, object: Three.Object3D, deps: EffectDeps): Effect
}

globalify({ Three: pkg.default, inScene: pkg.inScene })
