import globalify from '@sky-modules/core/globalify'

import * as imports from '../types.lite'

declare global {
    type DesignSystemContextType = imports.DesignSystemContextType
}

// No runtime values to globalize
