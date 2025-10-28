import globalify from '@sky-modules/core/globalify'

import * as imports from './consoleColors'

declare global {
    const reset: typeof imports.reset
    const bright: typeof imports.bright
    const dim: typeof imports.dim
    const reverse: typeof imports.reverse
    const hidden: typeof imports.hidden
    const black: typeof imports.black
    const red: typeof imports.red
    const green: typeof imports.green
    const yellow: typeof imports.yellow
    const blue: typeof imports.blue
    const magenta: typeof imports.magenta
    const cyan: typeof imports.cyan
    const white: typeof imports.white
    const bgBlack: typeof imports.bgBlack
    const bgRed: typeof imports.bgRed
    const bgGreen: typeof imports.bgGreen
    const bgYellow: typeof imports.bgYellow
    const bgBlue: typeof imports.bgBlue
    const bgMagenta: typeof imports.bgMagenta
    const bgCyan: typeof imports.bgCyan
    const bgWhite: typeof imports.bgWhite
    const bgGray: typeof imports.bgGray
}

globalify({ ...imports })
