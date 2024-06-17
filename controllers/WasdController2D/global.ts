import '../SmartPointerLock/global'

import globalify from 'sky/helpers/globalify'
import Vector2 from 'sky/math/Vector2'

import * as module from './-WasdController2D'

globalify({ WasdController2D: module.default })

declare global {
    interface WasdController2DOptions {
        force?: () => number
        direction?: () => number
        onUpdate?: () => void
    }
    class WasdController2D extends Effect {
        readonly acceleration: Vector2
        force: () => number
        direction: () => number

        constructor(deps: EffectDeps, options: WasdController2DOptions)
    }
}
