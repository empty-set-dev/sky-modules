// * Definition of global platform constants
namespace PlatformConstants {
    export let ARCH: Arch
    export let PLATFORM: Platform
    export let OS: OperationSystem
    export let APP_PLATFORM_TARGET: AppPlatformTarget = 'universal'

    if (typeof window !== 'undefined' && '__TAURI__' in window) {
        // * Tauri
        PLATFORM = 'desktop'
    } else if (typeof navigator !== 'undefined' && navigator.product === 'ReactNative') {
        // * Expo
        PLATFORM = 'mobile'
    } else {
        // * Web
        ARCH = 'web'
        PLATFORM = 'web'
        OS = 'web'
    }
}

Object.assign(global, PlatformConstants)
