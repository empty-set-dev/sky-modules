import '../initial'
import '../client-definitions.d'

import runsOnServerSide from '../runsOnServerSide'

console.log('platform web initial')

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

if (typeof arch !== 'undefined') {
    Object.assign(global, { appPlatformTarget: lib.appPlatformTarget })
} else {
    Object.assign(global, lib)
}

console.log(arch, platform, operationSystem, appPlatformTarget)
