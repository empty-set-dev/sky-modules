import '../initial'
import '../client-definitions.d'

import runsOnServerSide from '../runsOnServerSide'

namespace lib {
    export let arch = Arch.UNKNOWN
    export let platform = Platform.UNKNOWN
    export let operationSystem = OperationSystem.UNKNOWN
    export let appPlatformTarget = AppPlatformTarget.WEB

    if (runsOnServerSide) {
        platform = Platform.NODE
    } else {
        platform = Platform.WEB
    }
}

Object.assign(global, lib)
