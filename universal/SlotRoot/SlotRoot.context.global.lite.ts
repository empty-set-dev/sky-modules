import globalify from '@sky-modules/core/globalify'

import SlotRoot_context_lite, * as imports from './SlotRoot.context.lite'

declare global {
    const SlotRoot_context_lite: typeof imports.default
    type SlotRoot_context_lite = typeof imports.default
}

globalify({ SlotRoot_context_lite, ...imports })
