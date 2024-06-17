import globalify from 'sky/helpers/globalify'

import * as module from './-SmartPointerLock'

globalify({ SmartPointerLock: module.default })

declare global {
    class SmartPointerLock extends Effect {
        get isLocked(): boolean

        constructor(deps: EffectDeps)
    }
}
