import globalify from 'sky/helpers/globalify'

import * as pkg from '.'

declare global {
    type Three = void

    class InScene extends Effect {
        constructor(object: Three.Object3D, scene: Three.Scene, deps: EffectDeps)
    }
}

globalify({ Three: pkg.default, InScene: pkg.InScene })
