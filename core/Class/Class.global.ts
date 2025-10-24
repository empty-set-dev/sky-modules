import globalify from '@sky-modules/core/globalify'

import * as imports from './Class'

declare global {
    type Class = imports.default
}

// No runtime values to globalize
