import { runsOnServerSide } from '../utilities'

/**
 * Platform constants for web target applications
 *
 * Detects whether code runs on server-side (Node.js) or client-side (browser)
 * and sets platform accordingly. Works in SSR and client-only environments.
 *
 * Exposes global constants: ARCH, PLATFORM, OS, APP_PLATFORM_TARGET
 *
 * @example
 * ```ts
 * import '@sky-modules/platform/web/global'
 *
 * console.log(PLATFORM) // 'node' | 'web'
 * console.log(APP_PLATFORM_TARGET) // 'web'
 * ```
 */
namespace PlatformConstants {
    export let ARCH: Arch = 'unknown'
    export let PLATFORM: Platform = runsOnServerSide ? 'node' : 'web'
    export let OS: OperationSystem = 'unknown'
    export let APP_PLATFORM_TARGET: AppPlatformTarget = 'web'
}

// Check if platform constants are already initialized (e.g., from universal implementation)
if (typeof ARCH !== 'undefined' && ARCH !== 'unknown') {
    // Only update APP_PLATFORM_TARGET if constants are already set
    Object.assign(global, { APP_PLATFORM_TARGET: PlatformConstants.APP_PLATFORM_TARGET })
} else {
    // Initialize all platform constants
    Object.assign(global, PlatformConstants)
}
