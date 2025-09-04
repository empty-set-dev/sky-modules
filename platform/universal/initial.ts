import '../initial'
import '../client-definitions.d'

import './initial.scss'

namespace lib {
    export let arch = Arch.UNKNOWN
    export let platform = Platform.UNKNOWN
    export let operationSystem = OperationSystem.UNKNOWN
    export let appPlatformTarget = AppPlatformTarget.UNIVERSAL
}

Object.assign(global, lib)
