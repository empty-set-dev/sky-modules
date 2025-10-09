// import '@sky-modules/core/global'

// import './Effect'
// import './EffectThree'
// import '../../effects/dom/_standard-effects'

// declare global {
//     type EffectDeps = internal.BaseOfEffect | [parent: internal.BaseOfEffect, ...deps: EffectDep[]]
//     type Destructor = () => void | Promise<void>
//     class Effect extends lib.Effect {}
// }

import BaseOfEffect, * as lib from './internal/BaseOfEffect'

declare global {
    const BaseOfEffect: typeof lib.default
}

globalify({ BaseOfEffect })
