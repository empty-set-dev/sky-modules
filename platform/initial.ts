/**
 * * Initial setup for platform detection and global constants
 */
import runsOnServerSide from './runsOnServerSide'

declare global {
    type Arch = lib.Arch
    type Platform = lib.Platform
    type OperationSystem = lib.OperationSystem
    type AppPlatformTarget = lib.AppPlatformTarget

    const arch: Arch
    const operationSystem: OperationSystem
    const platform: Platform
    const appPlatformTarget: AppPlatformTarget
}

namespace lib {
    export type Arch = 'unknown' | 'Arm64' | 'x64'
    export type Platform = 'unknown' | 'node' | 'mobile' | 'desktop' | 'web'
    export type OperationSystem = 'unknown' | 'iOS' | 'Android' | 'Mac OS' | 'Windows' | 'Linux'
    export type AppPlatformTarget = 'unknown' | 'node' | 'web' | 'universal'

    export let arch: Arch = 'unknown'
    export let platform: Platform = 'unknown'
    export let operationSystem: OperationSystem = 'unknown'
    export let appPlatformTarget: AppPlatformTarget = 'unknown'

    if (!runsOnServerSide) {
        window.global = window
    }
}

Object.assign(global, lib)
