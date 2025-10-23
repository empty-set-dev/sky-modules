import globalify from '@sky-modules/core/globalify'

import SlotRootProvider_lite, * as imports from './SlotRootProvider.lite'

declare global {
    const SlotRootProvider_lite: typeof imports.default
    type SlotRootProvider_lite = typeof imports.default
    type SlotRootProviderProps = imports.SlotRootProviderProps
}

globalify({ SlotRootProvider_lite, ...imports })
