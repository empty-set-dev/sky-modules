/**
 * Fancy console configuration for Node.js
 *
 * Enhances default console output with:
 * - Colored console methods (info: cyan, warn: yellow, error: red, debug: black)
 * - Pretty-printed object inspection with syntax highlighting
 * - Configurable depth, getters, and numeric separators
 *
 * Automatically initializes on import.
 *
 * @example
 * ```ts
 * import '@sky-modules/platform/node/fancy-console'
 *
 * console.info('Information message') // cyan
 * console.warn('Warning message') // yellow
 * console.error('Error message') // red
 * console.log({ complex: { nested: { object: true } } }) // pretty-printed with colors
 * ```
 */
/* eslint-disable no-console */
import util from 'util'

// ANSI color codes for console output
const reset = '\x1b[0m'
const black = '\x1b[90m'
const red = '\x1b[91m'
const yellow = '\x1b[93m'
const cyan = '\x1b[96m'

type ConsoleOutputFunctionKey = 'info' | 'log' | 'debug' | 'warn' | 'error'

/**
 * Wrap console output function with color formatting
 *
 * @param type - Console method to wrap
 * @param color - ANSI color code to apply to string values
 */
function wrapConsoleOutputParameter(type: ConsoleOutputFunctionKey, color?: string): void {
    const original = <(...args: unknown[]) => void>console[type]
    console[type] = (...args: unknown[]): void =>
        original(
            ...args.map(value =>
                typeof value === 'string' ? `${color ?? ''}${value}${reset}` : util.inspect(value)
            )
        )
}

initFancyConsole()

/**
 * Initialize fancy console with enhanced output configuration
 */
function initFancyConsole(): void {
    // Configure util.inspect defaults for better object visualization
    util.inspect.defaultOptions.depth = 3
    util.inspect.defaultOptions.compact = false
    util.inspect.defaultOptions.getters = true
    util.inspect.defaultOptions.colors = true
    util.inspect.defaultOptions.numericSeparator = true

    // Configure type-specific color styles
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

    // Wrap console methods with color formatting
    wrapConsoleOutputParameter('info', cyan)
    wrapConsoleOutputParameter('log')
    wrapConsoleOutputParameter('debug', black)
    wrapConsoleOutputParameter('warn', yellow)
    wrapConsoleOutputParameter('error', red)
}
