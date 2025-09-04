const reset = '\x1b[0m'
const black = '\x1b[90m'
const red = '\x1b[91m'
const green = '\x1b[92m'
const yellow = '\x1b[93m'
const cyan = '\x1b[96m'

const consoleCopy = { ...console }

const Console = define('sky.standard.Console', {
    ...consoleCopy,
    success: (...args: Parameters<Console['log']>): void => {
        consoleCopy.log(
            `${green}%c✅ SUCCESS:${reset}`,
            'color: #10b981; font-weight: bold;',
            ...args.map(value => (typeof value === 'string' ? `${green}${value}${reset}` : value))
        )
    },
    info: (...args: Parameters<Console['info']>): void =>
        consoleCopy.info(
            `${cyan}%cℹ️  INFO:${reset}`,
            'white: #3b82f6; font-weight: bold;',
            ...args.map(value => (typeof value === 'string' ? `${cyan}${value}${reset}` : value))
        ),
    log: (...args: Parameters<Console['log']>): void => {
        consoleCopy.log(
            `${reset}%cℹ️ `,
            'color: #3b82f6; font-weight: bold;',
            ...args.map(value => (typeof value === 'string' ? `${reset}${value}` : value))
        )
    },
    debug: (...args: Parameters<Console['debug']>): void =>
        consoleCopy.debug(
            `${black}%c🐛 DEBUG:${reset}`,
            'color: #7782f6; font-weight: bold;',
            ...args.map(value => (typeof value === 'string' ? `${black}${value}${reset}` : value))
        ),
    warn: (...args: Parameters<Console['warn']>): void =>
        consoleCopy.warn(
            `${yellow}%c⚠️  WARN:${reset}`,
            'color: #f59e0b; font-weight: bold;',
            ...args.map(value => (typeof value === 'string' ? `${yellow}${value}${reset}` : value))
        ),
    error: (...args: Parameters<Console['error']>): void => {
        consoleCopy.error(
            `${red}%c❌ ERROR:${reset}`,
            'color: #ef4444; font-weight: bold;',
            ...args.map(value => (typeof value === 'string' ? `${red}${value}${reset}` : value))
        )
    },
})

export default Console
