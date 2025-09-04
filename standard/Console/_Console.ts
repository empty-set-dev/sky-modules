import { magenta, cyan, green, bright, yellow, red, reset } from './_consoleColors'

const consoleCopy = { ...console }
// TODO
const Console = define('sky.standard.Console', {
    ...consoleCopy,
    success: (...args: Parameters<typeof console.info>): void => {
        consoleCopy.info(
            `${green}${bright}%c✅SUCCESS:${reset}${green}`,
            'color: #10b981; font-weight: bold;',
            ...args
        )
    },
    info: (...args: Parameters<typeof console.info>): void =>
        consoleCopy.info(
            `${cyan}${bright}%cℹ️ INFO:${reset}${cyan}`,
            'white: #3b82f6; font-weight: bold;',
            ...args
        ),
    log: (...args: Parameters<typeof console.log>): void => {
        consoleCopy.log(
            `${reset}${bright}%cℹ️ LOG:${reset}`,
            'color: #3b82f6; font-weight: bold;',
            ...args
        )
    },
    debug: (...args: Parameters<typeof console.debug>): void =>
        consoleCopy.debug(
            `${magenta}${bright}%c🐛DEBUG:${reset}${magenta}`,
            'color: #7782f6; font-weight: bold;',
            ...args
        ),
    warn: (...args: Parameters<typeof console.warn>): void =>
        consoleCopy.warn(
            `${yellow}${bright}%c⚠️ WARN:${reset}${yellow}`,
            'color: #f59e0b; font-weight: bold;',
            ...args
        ),
    error: (...args: Parameters<typeof console.error>): void => {
        consoleCopy.error(
            `${red}${bright}%c❌${reset}${red}`,
            'color: #ef4444; font-weight: bold;',
            ...args
        )
    },
})

export default Console
