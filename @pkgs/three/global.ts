import globalify from 'sky/helpers/globalify'

import * as pkg from '.'

declare global {
    type Three = void

    function inScene(object: Three.Object3D, scene: Three.Scene, deps: EffectDeps): Effect
}

globalify({ Three: pkg.default, inScene: pkg.inScene })
