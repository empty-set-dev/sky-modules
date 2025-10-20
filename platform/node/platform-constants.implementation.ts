// * Node.js platform initialization file
import os from 'os'

namespace PlatformConstants {
    export let ARCH: Arch = 'unknown'
    export let PLATFORM: Platform = 'desktop'
    export let OS: OperationSystem = 'unknown'
    export let APP_PLATFORM_TARGET: AppPlatformTarget = 'node'
}

// * Definition of global platform constants
initNodePlatformConstants()

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
