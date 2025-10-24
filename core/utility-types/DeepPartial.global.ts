import globalify from '@sky-modules/core/globalify'

import * as imports from './DeepPartial'

declare global {
    type DeepPartial = imports.default
}

// No runtime values to globalize
