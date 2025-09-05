import runsOnServerSide from 'sky/platform/runsOnServerSide'
import { currentLocale } from 'sky/standard/currentLocale'

const reset = '\x1b[0m'
const black = '\x1b[90m'
const red = '\x1b[91m'
const green = '\x1b[92m'
const yellow = '\x1b[93m'
const cyan = '\x1b[96m'

const consoleCopy = { ...console }

function getTimeLabel(): string {
    const date = new Date()
    const dateString = new Intl.DateTimeFormat(currentLocale, {
        dateStyle: 'short',
    }).format(date)
    const timeString = new Intl.DateTimeFormat(currentLocale, {
        timeStyle: 'medium',
    }).format(date)
    return `${dateString} ${timeString} `
}

const Console = define(
    'sky.standard.Console',
    runsOnServerSide
        ? {
              ...consoleCopy,
              log: (...args: Parameters<Console['log']>): void => consoleCopy.log(`ℹ️ `, ...args),
              info: (...args: Parameters<Console['info']>): void =>
                  consoleCopy.log(
                      `${cyan} INFO ℹ️:${reset}`,
                      ...args.map(value =>
                          typeof value === 'string' ? `${cyan}${value}${reset}` : value
                      )
                  ),
              success: (...args: Parameters<Console['log']>): void =>
                  consoleCopy.log(
                      ...args.map(value =>
                          typeof value === 'string' ? `${green}${value}${reset}` : value
                      )
                  ),
              debug: (...args: Parameters<Console['debug']>): void =>
                  consoleCopy.log(
                      ...args.map(value =>
                          typeof value === 'string' ? `${black}${value}${reset}` : value
                      )
                  ),
              warn: (...args: Parameters<Console['warn']>): void =>
                  consoleCopy.log(
                      ...args.map(value =>
                          typeof value === 'string' ? `${yellow}${value}${reset}` : value
                      )
                  ),
              error: (...args: Parameters<Console['error']>): void =>
                  consoleCopy.log(
                      ...args.map(value =>
                          typeof value === 'string' ? `${red}${value}${reset}` : value
                      )
                  ),
          }
        : {
              ...consoleCopy,
              log: (...args: Parameters<Console['log']>): void =>
                  consoleCopy.log(
                      `%c%s ${args.map(value => (typeof value === 'string' ? '%s' : '%o')).join(' ')}`,
                      'color: #121212;',
                      `${getTimeLabel()}ℹ️`,
                      ...args
                  ),
              info: (...args: Parameters<Console['info']>): void =>
                  consoleCopy.info(
                      `%c%s ${args.map(value => (typeof value === 'string' ? '%s' : '%o')).join(' ')}`,
                      'color: #00aacc;',
                      `INFO ℹ️:`,
                      ...args
                  ),
              success: (...args: Parameters<Console['log']>): void =>
                  consoleCopy.log(
                      `%c%s ${args.map(value => (typeof value === 'string' ? '%s' : '%o')).join(' ')}`,
                      'color: #55cc55;',
                      `SUCCESS ✅:`,
                      ...args
                  ),
              debug: (...args: Parameters<Console['debug']>): void =>
                  consoleCopy.debug(
                      `%c%s ${args.map(value => (typeof value === 'string' ? '%s' : '%o')).join(' ')}`,
                      'color: #aaaaaa;',
                      `DEBUG 🌈:`,
                      ...args
                  ),
              warn: (...args: Parameters<Console['warn']>): void =>
                  consoleCopy.warn(
                      `%c%s ${args.map(value => (typeof value === 'string' ? '%s' : '%o')).join(' ')}`,
                      'color: #f59e0b;',
                      `WARN ⚠️:`,
                      ...args
                  ),
              error: (...args: Parameters<Console['error']>): void =>
                  consoleCopy.error(
                      `%c%s ${args.map(value => (typeof value === 'string' ? '%s' : '%o')).join(' ')}`,
                      'color: #ef4444;',
                      `❌`,
                      ...args
                  ),
          }
)

export default Console
