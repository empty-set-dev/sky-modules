/// <reference types="vite/client" />
/*
 * Main bootstrap file for the Universal platform
 * - Defines global platform constants
 */
// Ensure initial setup is done first
import '@sky-modules/platform'

// * Definition of global platform constants
namespace exports {
    export let ARCH: Arch
    export let PLATFORM: Platform
    export let OS: OperationSystem
    export let APP_PLATFORM_TARGET: AppPlatformTarget = 'universal'

    if (typeof window !== 'undefined' && '__TAURI__' in window) {
        // @ Tauri
        PLATFORM = 'desktop'
    } else if (typeof navigator !== 'undefined' && navigator.product === 'ReactNative') {
        // @ Expo
        PLATFORM = 'mobile'
    } else {
        // @ Web
        ARCH = 'web'
        PLATFORM = 'web'
        OS = 'web'
    }
}

Object.assign(global, exports)
