/**
 * Platform constants for Node.js target applications
 *
 * Detects system architecture (arm64/x64/arm) and operating system
 * (Mac OS/Windows/Linux) using Node.js os module.
 *
 * Exposes global constants: ARCH, PLATFORM, OS, APP_PLATFORM_TARGET
 *
 * @example
 * ```ts
 * import '@sky-modules/platform/node/global'
 *
 * console.log(ARCH) // 'arm64' | 'x64' | 'arm' | 'unknown'
 * console.log(OS) // 'Mac OS' | 'Windows' | 'Linux' | 'unknown'
 * console.log(PLATFORM) // 'desktop'
 * console.log(APP_PLATFORM_TARGET) // 'node'
 * ```
 */
import os from 'os'

namespace PlatformConstants {
    export let ARCH: Arch = 'unknown'
    export let PLATFORM: Platform = 'desktop'
    export let OS: OperationSystem = 'unknown'
    export let APP_PLATFORM_TARGET: AppPlatformTarget = 'node'
}

initNodePlatformConstants()

/**
 * Initialize Node.js platform constants based on runtime environment
 */
function initNodePlatformConstants(): void {
    const arch = os.arch()

    if (arch === 'arm64') {
        PlatformConstants.ARCH = 'arm64'
    } else if (arch === 'x64') {
        PlatformConstants.ARCH = 'x64'
    } else if (arch === 'arm') {
        PlatformConstants.ARCH = 'arm'
    }

    const platform = os.platform()

    if (platform === 'darwin') {
        PlatformConstants.OS = 'Mac OS'
    } else if (platform === 'win32') {
        PlatformConstants.OS = 'Windows'
    } else if (platform === 'linux') {
        PlatformConstants.OS = 'Linux'
    }
}

Object.assign(global, PlatformConstants)
