import globalify from '@sky-modules/core/globalify'

import * as imports from '../Material'

declare global {
    type MaterialParameters = imports.MaterialParameters
}

// No runtime values to globalize
