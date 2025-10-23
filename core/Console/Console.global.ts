import globalify from '@sky-modules/core/globalify'

import Console, * as imports from './Console'

declare global {
    const Console: typeof imports.default
    type Console = typeof imports.default
    const reset: typeof imports.reset
    const black: typeof imports.black
    const red: typeof imports.red
    const green: typeof imports.green
    const yellow: typeof imports.yellow
    const magenta: typeof imports.magenta
    const consoleCopy: typeof imports.consoleCopy
}

globalify({ Console, ...imports })
