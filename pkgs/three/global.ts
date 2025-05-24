import globalify from 'sky/utilities/globalify'

import * as module from '.'

declare global {
    type Three = void

    function inScene(scene: Three.Scene, object: Three.Object3D, deps: EffectDeps): Effect
}

globalify({ Three: module.default, inScene: module.inScene })
