/**
 * Platform constants for universal (web/desktop/mobile) targets
 *
 * Automatically detects the runtime environment and sets appropriate platform values:
 * - Tauri: desktop platform
 * - React Native: mobile platform
 * - Browser: web platform
 *
 * Exposes global constants: ARCH, PLATFORM, OS, APP_PLATFORM_TARGET
 *
 * @example
 * ```ts
 * import '@sky-modules/platform/universal/global'
 *
 * console.log(PLATFORM) // 'web' | 'desktop' | 'mobile'
 * console.log(APP_PLATFORM_TARGET) // 'universal'
 * ```
 */
namespace PlatformConstants {
    export let ARCH: Arch
    export let PLATFORM: Platform
    export let OS: OperationSystem
    export let APP_PLATFORM_TARGET: AppPlatformTarget = 'universal'

    if (typeof window !== 'undefined' && '__TAURI__' in window) {
        // Tauri desktop application
        PLATFORM = 'desktop'
    } else if (typeof navigator !== 'undefined' && navigator.product === 'ReactNative') {
        // React Native mobile application
        PLATFORM = 'mobile'
    } else {
        // Web browser
        ARCH = 'web'
        PLATFORM = 'web'
        OS = 'web'
    }
}

Object.assign(global, PlatformConstants)
