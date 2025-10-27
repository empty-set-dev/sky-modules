import globalify from '@sky-modules/core/globalify'

import * as imports from './consoleColors'

declare global {
    const reset: typeof imports.reset
    type reset = typeof imports.reset
    const bright: typeof imports.bright
    type bright = typeof imports.bright
    const dim: typeof imports.dim
    type dim = typeof imports.dim
    const reverse: typeof imports.reverse
    type reverse = typeof imports.reverse
    const hidden: typeof imports.hidden
    type hidden = typeof imports.hidden
    const black: typeof imports.black
    type black = typeof imports.black
    const red: typeof imports.red
    type red = typeof imports.red
    const green: typeof imports.green
    type green = typeof imports.green
    const yellow: typeof imports.yellow
    type yellow = typeof imports.yellow
    const blue: typeof imports.blue
    type blue = typeof imports.blue
    const magenta: typeof imports.magenta
    type magenta = typeof imports.magenta
    const cyan: typeof imports.cyan
    type cyan = typeof imports.cyan
    const white: typeof imports.white
    type white = typeof imports.white
    const bgBlack: typeof imports.bgBlack
    type bgBlack = typeof imports.bgBlack
    const bgRed: typeof imports.bgRed
    type bgRed = typeof imports.bgRed
    const bgGreen: typeof imports.bgGreen
    type bgGreen = typeof imports.bgGreen
    const bgYellow: typeof imports.bgYellow
    type bgYellow = typeof imports.bgYellow
    const bgBlue: typeof imports.bgBlue
    type bgBlue = typeof imports.bgBlue
    const bgMagenta: typeof imports.bgMagenta
    type bgMagenta = typeof imports.bgMagenta
    const bgCyan: typeof imports.bgCyan
    type bgCyan = typeof imports.bgCyan
    const bgWhite: typeof imports.bgWhite
    type bgWhite = typeof imports.bgWhite
    const bgGray: typeof imports.bgGray
    type bgGray = typeof imports.bgGray
}

globalify({ ...imports })
