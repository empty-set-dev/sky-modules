/**
 * * Main bootstrap file for the Web platform
 * * - Defines global platform constants
 */
// * Ensure initial setup is done first
import 'sky/standard/initial'

import './sx.global'

import runsOnServerSide from '../runsOnServerSide'

// * Definition of global platform constants
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
