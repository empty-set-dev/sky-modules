import '../initial'
import '../client-definitions.d'

import runsOnServerSide from '../runsOnServerSide'

namespace lib {
    export let arch: Arch = 'unknown'
    export let platform: Platform = 'unknown'
    export let operationSystem: OperationSystem = 'unknown'
    export let appPlatformTarget: AppPlatformTarget = 'web'

    if (runsOnServerSide) {
        platform = 'node'
    } else {
        platform = 'web'
    }
}

if (typeof arch !== 'undefined') {
    Object.assign(global, { appPlatformTarget: lib.appPlatformTarget })
} else {
    Object.assign(global, lib)
}
