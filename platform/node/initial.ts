/* eslint-disable no-console */
import '../initial'

import os from 'os'
import util from 'util'

namespace lib {
    export let arch: Arch = 'unknown'
    export let platform: Platform = 'desktop'
    export let operationSystem: OperationSystem = 'unknown'
    export let appPlatformTarget: AppPlatformTarget = 'node'

    if (os.arch() === 'arm64') {
        arch = 'Arm64'
    }

    if (os.platform() === 'darwin') {
        operationSystem = 'Mac OS'
    } else if (os.platform() === 'win32') {
        operationSystem = 'Windows'
    } else if (os.platform() === 'linux') {
        operationSystem = 'Linux'
    }
}

Object.assign(global, lib)

util.inspect.defaultOptions.depth = 3
util.inspect.defaultOptions.compact = false
util.inspect.defaultOptions.getters = true
util.inspect.defaultOptions.colors = true
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

// \x1b[38;2;0;128;255m

const reset = '\x1b[0m'
const black = '\x1b[90m'
const red = '\x1b[91m'
const yellow = '\x1b[93m'
const cyan = '\x1b[96m'

type ConsoleOutputFunctionKey = 'info' | 'log' | 'debug' | 'warn' | 'error'

wrapConsoleOutputParameter('info', cyan)
wrapConsoleOutputParameter('log', '')
wrapConsoleOutputParameter('debug', black)
wrapConsoleOutputParameter('warn', yellow)
wrapConsoleOutputParameter('error', red)
function wrapConsoleOutputParameter(type: ConsoleOutputFunctionKey, color: string): void {
    const original = <(...args: unknown[]) => void>console[type]
    console[type] = (...args: unknown[]): void =>
        original(
            ...args.map(value =>
                typeof value === 'string' ? `${color}${value}${reset}` : util.inspect(value)
            )
        )
}
