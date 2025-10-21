import '@sky-modules/core/define/global'

import { runsOnServerSide } from '@sky-modules/platform/utilities/runsOnSide'

namespace internal {
    export const reset = '\x1b[0m'
    export const black = '\x1b[90m'
    export const red = '\x1b[91m'
    export const green = '\x1b[92m'
    export const yellow = '\x1b[93m'
    export const magenta = '\x1b[38;05;127;05;232m'

    export const consoleCopy = { ...console }
}

const Console = define(
    'sky.standard.Console',
    runsOnServerSide
        ? {
              ...internal.consoleCopy,
              log: (...args: Parameters<Console['log']>): void =>
                  internal.consoleCopy.log(`ℹ️ `, ...args),
              info: (...args: Parameters<Console['info']>): void =>
                  internal.consoleCopy.log(
                      `${internal.magenta}INFO ℹ️ :${internal.reset}`,
                      ...args.map(value =>
                          typeof value === 'string'
                              ? `${internal.magenta}${value}${internal.reset}`
                              : value
                      )
                  ),
              success: (...args: Parameters<Console['log']>): void =>
                  internal.consoleCopy.log(
                      `${internal.green}SUCCESS ✅:${internal.reset}`,
                      ...args.map(value =>
                          typeof value === 'string'
                              ? `${internal.green}${value}${internal.reset}`
                              : value
                      )
                  ),
              debug: (...args: Parameters<Console['debug']>): void =>
                  internal.consoleCopy.log(
                      `${internal.black}DEBUG 🌈:${internal.reset}`,
                      ...args.map(value =>
                          typeof value === 'string'
                              ? `${internal.black}${value}${internal.reset}`
                              : value
                      )
                  ),
              warn: (...args: Parameters<Console['warn']>): void =>
                  internal.consoleCopy.log(
                      `${internal.yellow}WARN ⚠️ :`,
                      ...args.map(value =>
                          typeof value === 'string'
                              ? `${internal.yellow}${value}${internal.reset}`
                              : value
                      )
                  ),
              error: (...args: Parameters<Console['error']>): void =>
                  internal.consoleCopy.log(
                      `${internal.red}ERROR ❌:`,
                      ...args.map(value =>
                          typeof value === 'string'
                              ? `${internal.red}${value}${internal.reset}`
                              : value
                      )
                  ),
          }
        : {
              ...internal.consoleCopy,
              log: (...args: Parameters<Console['log']>): void =>
                  internal.consoleCopy.log(
                      `%c%s ${args.map(value => (typeof value === 'string' ? '%s' : '%o')).join(' ')}`,
                      'color: #121212;',
                      `ℹ️`,
                      ...args
                  ),
              info: (...args: Parameters<Console['info']>): void =>
                  internal.consoleCopy.info(
                      `%c%s ${args.map(value => (typeof value === 'string' ? '%s' : '%o')).join(' ')}`,
                      'color: #cc00aa;',
                      `INFO ℹ️:`,
                      ...args
                  ),
              success: (...args: Parameters<Console['log']>): void =>
                  internal.consoleCopy.log(
                      `%c%s ${args.map(value => (typeof value === 'string' ? '%s' : '%o')).join(' ')}`,
                      'color: #55cc55;',
                      `SUCCESS ✅:`,
                      ...args
                  ),
              debug: (...args: Parameters<Console['debug']>): void =>
                  internal.consoleCopy.debug(
                      `%c%s ${args.map(value => (typeof value === 'string' ? '%s' : '%o')).join(' ')}`,
                      'color: #aaaaaa;',
                      `DEBUG 🌈:`,
                      ...args
                  ),
              warn: (...args: Parameters<Console['warn']>): void =>
                  internal.consoleCopy.warn(
                      `%c%s ${args.map(value => (typeof value === 'string' ? '%s' : '%o')).join(' ')}`,
                      'color: #f59e0b;',
                      `WARN ⚠️:`,
                      ...args
                  ),
              error: (...args: Parameters<Console['error']>): void =>
                  internal.consoleCopy.error(
                      `%c%s ${args.map(value => (typeof value === 'string' ? '%s' : '%o')).join(' ')}`,
                      'color: #ef4444;',
                      `ERROR ❌:`,
                      ...args
                  ),
          }
)
export default Console
