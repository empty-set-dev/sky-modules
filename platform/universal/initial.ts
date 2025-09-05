import '../initial'
import '../client-definitions.d'

import './initial.scss'

namespace lib {
    export let arch: Arch = 'unknown'
    export let platform: Platform = 'unknown'
    export let operationSystem: OperationSystem = 'unknown'
    export let appPlatformTarget: AppPlatformTarget = 'universal'
}

Object.assign(global, lib)
