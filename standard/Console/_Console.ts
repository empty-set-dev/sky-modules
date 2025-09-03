import { magenta, cyan, green, bright, yellow, red } from './_consoleColors'
iAm('sky.standard.Console', await import('./_Console'))

declare global {
    interface Modules {
        'sky.standard.Console': typeof import('./_Console')
    }
}

const consoleCopy = { ...console }

const Console = define('sky.standard.Console', {
    ...consoleCopy,
    success: (...args: Parameters<typeof console.info>): void =>
        consoleCopy.info(
            `${green}${bright}%cSUCCESS ✅:`,
            'color: #10b981; font-weight: bold;',
            ...args
        ),
    info: (...args: Parameters<typeof console.info>): void =>
        consoleCopy.info(
            `${cyan}${bright}%cINFO ℹ️:`,
            'color: #3b82f6; font-weight: bold;',
            ...args
        ),
    log: (...args: Parameters<typeof console.log>): void => consoleCopy.log(`%cLOG ℹ️:`, ...args),
    debug: (...args: Parameters<typeof console.debug>): void =>
        consoleCopy.debug(
            `${magenta}${bright}%cDEBUG 🐛:`,
            'color: #7782f6; font-weight: bold;',
            ...args
        ),
    warn: (...args: Parameters<typeof console.warn>): void =>
        consoleCopy.warn(
            `${yellow}${bright}%cWARN ⚠️:`,
            'color: #f59e0b; font-weight: bold;',
            ...args
        ),
    error: (...args: Parameters<typeof console.error>): void =>
        consoleCopy.error(
            `${red}${bright}%cERROR ❌:`,
            'color: #ef4444; font-weight: bold;',
            ...args
        ),
})

export default Console
