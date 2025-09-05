import runsOnServerSide from 'sky/platform/runsOnServerSide'
import { currentLocale } from 'sky/standard/currentLocale'

const reset = '\x1b[0m'
const green = '\x1b[92m'

const consoleCopy = { ...console }

function getTimeLabel(): string {
    const date = new Date()
    const dateString = new Intl.DateTimeFormat(currentLocale, {
        dateStyle: 'short',
    }).format(date)
    const timeString = new Intl.DateTimeFormat(currentLocale, {
        timeStyle: 'medium',
    }).format(date)
    return `${dateString}:${timeString}`
}

const Console = define(
    'sky.standard.Console',
    runsOnServerSide
        ? {
              ...consoleCopy,
              success: (...args: Parameters<Console['log']>): void =>
                  consoleCopy.log(
                      ...args.map(value =>
                          typeof value === 'string' ? `${green}${value}${reset}` : value
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
