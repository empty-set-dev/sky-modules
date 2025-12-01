import globalify from '@sky-modules/core/globalify'

import SlotRootProvider, * as imports from '../SlotRootProvider.lite'

declare global {
    const SlotRootProvider: typeof imports.default
    type SlotRootProvider = typeof imports.default
    type SlotRootProviderProps = imports.SlotRootProviderProps
}

globalify({ SlotRootProvider })
