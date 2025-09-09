import globalify from 'sky/standard/globalify'

import sx, * as lib from './sx'

declare global {
    const sx: typeof lib.default
}

globalify({ sx, ...lib })
