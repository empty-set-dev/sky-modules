import 'sky/standard/modules'
import 'sky/standard/define/global'

import runsOnServerSide from 'sky/platform/runsOnServerSide'
iAm('sky.standard.Console', import('./Console'))

declare global {
    interface Modules {
        'sky.standard.Console': typeof import('./Console')
    }
}

const reset = '\x1b[0m'
const black = '\x1b[90m'
const red = '\x1b[91m'
const green = '\x1b[92m'
const yellow = '\x1b[93m'
const magenta = '\x1b[38;05;127;05;232m'

const consoleCopy = { ...console }

const Console = define(
    'sky.standard.Console',
    runsOnServerSide
        ? {
              ...consoleCopy,
              log: (...args: Parameters<Console['log']>): void => consoleCopy.log(`ℹ️ `, ...args),
              info: (...args: Parameters<Console['info']>): void =>
                  consoleCopy.log(
                      `${magenta}INFO ℹ️ :${reset}`,
                      ...args.map(value =>
                          typeof value === 'string' ? `${magenta}${value}${reset}` : value
                      )
                  ),
              success: (...args: Parameters<Console['log']>): void =>
                  consoleCopy.log(
                      `${green}SUCCESS ✅:${reset}`,
                      ...args.map(value =>
                          typeof value === 'string' ? `${green}${value}${reset}` : value
                      )
                  ),
              debug: (...args: Parameters<Console['debug']>): void =>
                  consoleCopy.log(
                      `${black}DEBUG 🌈:${reset}`,
                      ...args.map(value =>
                          typeof value === 'string' ? `${black}${value}${reset}` : value
                      )
                  ),
              warn: (...args: Parameters<Console['warn']>): void =>
                  consoleCopy.log(
                      `${yellow}WARN ⚠️ :`,
                      ...args.map(value =>
                          typeof value === 'string' ? `${yellow}${value}${reset}` : value
                      )
                  ),
              error: (...args: Parameters<Console['error']>): void =>
                  consoleCopy.log(
                      `${red}ERROR ❌:`,
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
                      `ℹ️`,
                      ...args
                  ),
              info: (...args: Parameters<Console['info']>): void =>
                  consoleCopy.info(
                      `%c%s ${args.map(value => (typeof value === 'string' ? '%s' : '%o')).join(' ')}`,
                      'color: #cc00aa;',
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
                      `ERROR ❌:`,
                      ...args
                  ),
          }
)

export default Console
