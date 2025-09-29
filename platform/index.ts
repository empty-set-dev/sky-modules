/*
 * Initial setup for platform detection and global constants
 */
import runsOnSide from './runsOnSide'

declare global {
    type Arch = lib.Arch
    type Platform = lib.Platform
    type OperationSystem = lib.OperationSystem
    type AppPlatformTarget = lib.AppPlatformTarget

    const ARCH: Arch
    const PLATFORM: Platform
    const OS: OperationSystem
    const APP_PLATFORM_TARGET: AppPlatformTarget
}

namespace lib {
    export type Arch = 'unknown' | 'Arm64' | 'x64'
    export type Platform = 'unknown' | 'node' | 'mobile' | 'desktop' | 'web'
    export type OperationSystem = 'unknown' | 'iOS' | 'Android' | 'Mac OS' | 'Windows' | 'Linux'
    export type AppPlatformTarget = 'unknown' | 'node' | 'web' | 'universal'

    export let ARCH: Arch = 'unknown'
    export let PLATFORM: Platform = 'unknown'
    export let OS: OperationSystem = 'unknown'
    export let APP_PLATFORM_TARGET: AppPlatformTarget = 'unknown'
}

initPlatform()

function initPlatform(): void {
    if (runsOnSide === 'client') {
        window.global = window
    }
}

Object.assign(global, lib)
