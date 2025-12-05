import globalify from '@sky-modules/core/globalify'

import * as imports from '../types.lite'

declare global {
    type SlotRootStyles = imports.SlotRootStyles
    type SlotRootController = imports.SlotRootController
    type SlotRootContextType = imports.SlotRootContextType
}

// No runtime values to globalize
