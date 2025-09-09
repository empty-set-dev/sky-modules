// * Node.js platform initialization file
import os from 'os'

namespace lib {
    export let arch: Arch = 'unknown'
    export let platform: Platform = 'desktop'
    export let operationSystem: OperationSystem = 'unknown'
    export let appPlatformTarget: AppPlatformTarget = 'node'
}

// * Definition of global platform constants
initNodePlatform()

function initNodePlatform(): void {
    if (os.arch() === 'arm64') {
        lib.arch = 'Arm64'
    }

    if (os.platform() === 'darwin') {
        lib.operationSystem = 'Mac OS'
    } else if (os.platform() === 'win32') {
        lib.operationSystem = 'Windows'
    } else if (os.platform() === 'linux') {
        lib.operationSystem = 'Linux'
    }
}

Object.assign(global, lib)
