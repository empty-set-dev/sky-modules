import globalify from '@sky-modules/core/globalify'

import SlotRoot_context, * as imports from './SlotRoot.context.lite'

declare global {
    const SlotRoot_context: typeof imports.default
    type SlotRoot_context = typeof imports.default
}

globalify({ SlotRoot_context, ...imports })
