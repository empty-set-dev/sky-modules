import globalify from '@sky-modules/core/globalify'

import * as lib from '.'

declare global {
    type Three = void

    function inScene(scene: Three.Scene, object: Three.Object3D, deps: EffectDeps): Effect
}

globalify({ Three: lib.default, inScene: lib.inScene })
