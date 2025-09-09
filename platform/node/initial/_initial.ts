// * Node.js platform initialization file
import os from 'os'

namespace lib {
    export let ARCH: Arch = 'unknown'
    export let PLATFORM: Platform = 'desktop'
    export let OS: OperationSystem = 'unknown'
    export let APP_PLATFORM_TARGET: AppPlatformTarget = 'node'
}

// * Definition of global platform constants
initNodePlatform()

function initNodePlatform(): void {
    if (os.arch() === 'arm64') {
        lib.ARCH = 'Arm64'
    }

    if (os.platform() === 'darwin') {
        lib.OS = 'Mac OS'
    } else if (os.platform() === 'win32') {
        lib.OS = 'Windows'
    } else if (os.platform() === 'linux') {
        lib.OS = 'Linux'
    }
}

Object.assign(global, lib)
