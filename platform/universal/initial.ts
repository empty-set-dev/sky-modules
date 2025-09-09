/*
 * Main bootstrap file for the Universal platform
 * - Defines global platform constants
 */
// * Ensure initial setup is done first
import 'sky/platform/initial'

import './initial.scss'

// * Definition of global platform constants
namespace lib {
    // export let arch: Arch
    // export let platform: Platform
    // export let operationSystem: OperationSystem
    export let appPlatformTarget: AppPlatformTarget = 'universal'
}

Object.assign(global, lib)
