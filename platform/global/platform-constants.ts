/*
 * Initial setup for platform detection and global constants
 */
export {}

declare global {
    type Arch = 'unknown' | 'arm' | 'arm64' | 'x64' | 'web'
    type Platform = 'unknown' | 'node' | 'mobile' | 'desktop' | 'web'
    type OperationSystem = 'unknown' | 'iOS' | 'Android' | 'Mac OS' | 'Windows' | 'Linux' | 'web'
    type AppPlatformTarget = 'unknown' | 'node' | 'web' | 'universal'
    const ARCH: Arch
    const PLATFORM: Platform
    const OS: OperationSystem
    const APP_PLATFORM_TARGET: AppPlatformTarget
}

namespace PlatformConstants {
    export let ARCH: Arch = 'unknown'
    export let PLATFORM: Platform = 'unknown'
    export let OS: OperationSystem = 'unknown'
    export let APP_PLATFORM_TARGET: AppPlatformTarget = 'unknown'
}

Object.assign(global, PlatformConstants)
