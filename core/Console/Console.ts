import { runsOnServerSide } from '@sky-modules/platform/utilities/runsOnSide'

import define from '../define'

namespace Internal {
    export const reset = '\x1b[0m'
    export const black = '\x1b[90m'
    export const red = '\x1b[91m'
    export const green = '\x1b[92m'
    export const yellow = '\x1b[93m'
    export const magenta = '\x1b[38;05;127;05;232m'

    export const consoleCopy = { ...console }
}

const Console = define(
    'sky.core.Console',
    runsOnServerSide
        ? {
              ...Internal.consoleCopy,
              log: (...args: Parameters<Console['log']>): void =>
                  Internal.consoleCopy.log(`ℹ️ `, ...args),
              info: (...args: Parameters<Console['info']>): void =>
                  Internal.consoleCopy.log(
                      `${Internal.magenta}INFO ℹ️ :${Internal.reset}`,
                      ...args.map(value =>
                          typeof value === 'string'
                              ? `${Internal.magenta}${value}${Internal.reset}`
                              : value
                      )
                  ),
              success: (...args: Parameters<Console['log']>): void =>
                  Internal.consoleCopy.log(
                      `${Internal.green}SUCCESS ✅:${Internal.reset}`,
                      ...args.map(value =>
                          typeof value === 'string'
                              ? `${Internal.green}${value}${Internal.reset}`
                              : value
                      )
                  ),
              debug: (...args: Parameters<Console['debug']>): void =>
                  Internal.consoleCopy.log(
                      `${Internal.black}DEBUG 🌈:${Internal.reset}`,
                      ...args.map(value =>
                          typeof value === 'string'
                              ? `${Internal.black}${value}${Internal.reset}`
                              : value
                      )
                  ),
              warn: (...args: Parameters<Console['warn']>): void =>
                  Internal.consoleCopy.log(
                      `${Internal.yellow}WARN ⚠️ :`,
                      ...args.map(value =>
                          typeof value === 'string'
                              ? `${Internal.yellow}${value}${Internal.reset}`
                              : value
                      )
                  ),
              error: (...args: Parameters<Console['error']>): void =>
                  Internal.consoleCopy.log(
                      `${Internal.red}ERROR ❌:`,
                      ...args.map(value =>
                          typeof value === 'string'
                              ? `${Internal.red}${value}${Internal.reset}`
                              : value
                      )
                  ),
          }
        : {
              ...Internal.consoleCopy,
              log: (...args: Parameters<Console['log']>): void =>
                  Internal.consoleCopy.log(
                      `%c%s ${args.map(value => (typeof value === 'string' ? '%s' : '%o')).join(' ')}`,
                      'color: #121212;',
                      `ℹ️`,
                      ...args
                  ),
              info: (...args: Parameters<Console['info']>): void =>
                  Internal.consoleCopy.info(
                      `%c%s ${args.map(value => (typeof value === 'string' ? '%s' : '%o')).join(' ')}`,
                      'color: #cc00aa;',
                      `INFO ℹ️:`,
                      ...args
                  ),
              success: (...args: Parameters<Console['log']>): void =>
                  Internal.consoleCopy.log(
                      `%c%s ${args.map(value => (typeof value === 'string' ? '%s' : '%o')).join(' ')}`,
                      'color: #55cc55;',
                      `SUCCESS ✅:`,
                      ...args
                  ),
              debug: (...args: Parameters<Console['debug']>): void =>
                  Internal.consoleCopy.debug(
                      `%c%s ${args.map(value => (typeof value === 'string' ? '%s' : '%o')).join(' ')}`,
                      'color: #aaaaaa;',
                      `DEBUG 🌈:`,
                      ...args
                  ),
              warn: (...args: Parameters<Console['warn']>): void =>
                  Internal.consoleCopy.warn(
                      `%c%s ${args.map(value => (typeof value === 'string' ? '%s' : '%o')).join(' ')}`,
                      'color: #f59e0b;',
                      `WARN ⚠️:`,
                      ...args
                  ),
              error: (...args: Parameters<Console['error']>): void =>
                  Internal.consoleCopy.error(
                      `%c%s ${args.map(value => (typeof value === 'string' ? '%s' : '%o')).join(' ')}`,
                      'color: #ef4444;',
                      `ERROR ❌:`,
                      ...args
                  ),
          }
)
export default Console
