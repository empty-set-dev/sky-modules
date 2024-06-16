import globalify from 'sky/helpers/globalify'
import Vector2 from 'sky/math/Vector2'
import Vector3 from 'sky/math/Vector3'

import * as module from './-WasdController'

globalify({ WasdController: module.default })

declare global {
    interface WasdControllerOptions {
        force?: number
        direction?: Vector3
        onUpdate?: () => void
    }
    class WasdController extends Effect {
        readonly acceleration: Vector2
        force: number
        direction: Vector3

        constructor(deps: EffectDeps, options: WasdControllerOptions)
    }
}
