import '@sky-modules/core/define/global'

import { runsOnServerSide } from '@sky-modules/platform/runsOnSide'

namespace local {
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
              ...local.consoleCopy,
              log: (...args: Parameters<Console['log']>): void =>
                  local.consoleCopy.log(`ℹ️ `, ...args),
              info: (...args: Parameters<Console['info']>): void =>
                  local.consoleCopy.log(
                      `${local.magenta}INFO ℹ️ :${local.reset}`,
                      ...args.map(value =>
                          typeof value === 'string'
                              ? `${local.magenta}${value}${local.reset}`
                              : value
                      )
                  ),
              success: (...args: Parameters<Console['log']>): void =>
                  local.consoleCopy.log(
                      `${local.green}SUCCESS ✅:${local.reset}`,
                      ...args.map(value =>
                          typeof value === 'string' ? `${local.green}${value}${local.reset}` : value
                      )
                  ),
              debug: (...args: Parameters<Console['debug']>): void =>
                  local.consoleCopy.log(
                      `${local.black}DEBUG 🌈:${local.reset}`,
                      ...args.map(value =>
                          typeof value === 'string' ? `${local.black}${value}${local.reset}` : value
                      )
                  ),
              warn: (...args: Parameters<Console['warn']>): void =>
                  local.consoleCopy.log(
                      `${local.yellow}WARN ⚠️ :`,
                      ...args.map(value =>
                          typeof value === 'string'
                              ? `${local.yellow}${value}${local.reset}`
                              : value
                      )
                  ),
              error: (...args: Parameters<Console['error']>): void =>
                  local.consoleCopy.log(
                      `${local.red}ERROR ❌:`,
                      ...args.map(value =>
                          typeof value === 'string' ? `${local.red}${value}${local.reset}` : value
                      )
                  ),
          }
        : {
              ...local.consoleCopy,
              log: (...args: Parameters<Console['log']>): void =>
                  local.consoleCopy.log(
                      `%c%s ${args.map(value => (typeof value === 'string' ? '%s' : '%o')).join(' ')}`,
                      'color: #121212;',
                      `ℹ️`,
                      ...args
                  ),
              info: (...args: Parameters<Console['info']>): void =>
                  local.consoleCopy.info(
                      `%c%s ${args.map(value => (typeof value === 'string' ? '%s' : '%o')).join(' ')}`,
                      'color: #cc00aa;',
                      `INFO ℹ️:`,
                      ...args
                  ),
              success: (...args: Parameters<Console['log']>): void =>
                  local.consoleCopy.log(
                      `%c%s ${args.map(value => (typeof value === 'string' ? '%s' : '%o')).join(' ')}`,
                      'color: #55cc55;',
                      `SUCCESS ✅:`,
                      ...args
                  ),
              debug: (...args: Parameters<Console['debug']>): void =>
                  local.consoleCopy.debug(
                      `%c%s ${args.map(value => (typeof value === 'string' ? '%s' : '%o')).join(' ')}`,
                      'color: #aaaaaa;',
                      `DEBUG 🌈:`,
                      ...args
                  ),
              warn: (...args: Parameters<Console['warn']>): void =>
                  local.consoleCopy.warn(
                      `%c%s ${args.map(value => (typeof value === 'string' ? '%s' : '%o')).join(' ')}`,
                      'color: #f59e0b;',
                      `WARN ⚠️:`,
                      ...args
                  ),
              error: (...args: Parameters<Console['error']>): void =>
                  local.consoleCopy.error(
                      `%c%s ${args.map(value => (typeof value === 'string' ? '%s' : '%o')).join(' ')}`,
                      'color: #ef4444;',
                      `ERROR ❌:`,
                      ...args
                  ),
          }
)
export default Console
