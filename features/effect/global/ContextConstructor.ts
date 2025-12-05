import globalify from '@sky-modules/core/globalify'

import * as imports from '../ContextConstructor'

declare global {
    type ContextConstructor = imports.default
}

// No runtime values to globalize
