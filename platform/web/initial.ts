/**
 * Main bootstrap file for the Web platform
 * - Defines global platform constants
 */
// Ensure initial setup is done first
import 'sky/platform/initial'

import { runsOnServerSide } from 'sky/platform/runsOnSide'

// Definition of global platform constants
namespace lib {
    export let ARCH: Arch = 'unknown'
    export let PLATFORM: Platform = runsOnServerSide ? 'node' : 'web'
    export let OS: OperationSystem = 'unknown'
    export let APP_PLATFORM_TARGET: AppPlatformTarget = 'web'
}

if (typeof ARCH !== 'undefined') {
    Object.assign(global, { APP_PLATFORM_TARGET: lib.APP_PLATFORM_TARGET })
} else {
    Object.assign(global, lib)
}
