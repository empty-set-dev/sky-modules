import '../initial'

import cluster from 'cluster'
import os from 'os'
import util from 'util'

if (cluster.isPrimary) {
    // eslint-disable-next-line no-console
    console.clear()
}

console.log('platform node initial')

namespace lib {
    export let arch = Arch.UNKNOWN
    export let platform = Platform.DESKTOP
    export let operationSystem = OperationSystem.UNKNOWN
    export let appPlatformTarget = AppPlatformTarget.NODE

    if (os.arch() === 'arm64') {
        arch = Arch.ARM64
    }

    if (os.platform() === 'darwin') {
        operationSystem = OperationSystem.MACOS
    } else if (os.platform() === 'win32') {
        operationSystem = OperationSystem.WINDOWS
    } else if (os.platform() === 'linux') {
        operationSystem = OperationSystem.LINUX
    }
}

Object.assign(global, lib)

console.log(arch, platform, operationSystem, appPlatformTarget)

util.inspect.defaultOptions.depth = 3
util.inspect.defaultOptions.compact = false
util.inspect.defaultOptions.getters = true
util.inspect.defaultOptions.numericSeparator = true

util.inspect.styles.undefined = 'gray'
util.inspect.styles.null = 'gray'

util.inspect.styles.bigint = 'yellowBright'
util.inspect.styles.boolean = 'yellowBright'
util.inspect.styles.number = 'yellowBright'

util.inspect.styles.string = 'greenBright'
util.inspect.styles.date = 'greenBright'

util.inspect.styles.module = 'underline'
util.inspect.styles.regexp = 'redBright'
util.inspect.styles.symbol = 'magentaBright'
util.inspect.styles.special = 'cyanBright'
