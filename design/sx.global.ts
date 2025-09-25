import globalify from 'sky/core/globalify'

import sx, * as lib from './sx'

declare global {
    const sx: typeof lib.default
}

globalify({ sx, ...lib })
