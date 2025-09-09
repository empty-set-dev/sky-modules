/**
 * * Initial fancy console configuration
 */
/* eslint-disable no-console */
import util from 'util'

namespace local {
    // ** Colors for console output
    export const reset = '\x1b[0m'
    export const black = '\x1b[90m'
    export const red = '\x1b[91m'
    export const yellow = '\x1b[93m'
    export const cyan = '\x1b[96m'

    // ** Wrapper for colored console output
    export type ConsoleOutputFunctionKey = 'info' | 'log' | 'debug' | 'warn' | 'error'

    export function wrapConsoleOutputParameter(
        type: ConsoleOutputFunctionKey,
        color?: string
    ): void {
        const original = <(...args: unknown[]) => void>console[type]
        console[type] = (...args: unknown[]): void =>
            original(
                ...args.map(value =>
                    typeof value === 'string'
                        ? `${color ?? ''}${value}${reset}`
                        : util.inspect(value)
                )
            )
    }
}

initFancyConsole()

function initFancyConsole(): void {
    // * Console output configuration
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

    local.wrapConsoleOutputParameter('info', local.cyan)
    local.wrapConsoleOutputParameter('log')
    local.wrapConsoleOutputParameter('debug', local.black)
    local.wrapConsoleOutputParameter('warn', local.yellow)
    local.wrapConsoleOutputParameter('error', local.red)
}
