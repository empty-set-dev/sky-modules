/*
 * Main bootstrap file for the Universal platform
 * - Defines global platform constants
 */
// * Ensure initial setup is done first
import '@sky-modules/platform/initial'

import './initial.scss'

// * Definition of global platform constants
namespace lib {
    // export let ARCH: Arch
    // export let PLATFORM: Platform
    // export let OS: OperationSystem
    export let APP_PLATFORM_TARGET: AppPlatformTarget = 'universal'
}

Object.assign(global, lib)
