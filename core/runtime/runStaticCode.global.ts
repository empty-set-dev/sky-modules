import globalify from '@sky-modules/core/globalify'

import * as imports from './runStaticCode'

declare global {
    type runStaticCode = imports.default
}

// No runtime values to globalize
