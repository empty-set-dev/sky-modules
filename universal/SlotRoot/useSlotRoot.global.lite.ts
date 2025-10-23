import globalify from '@sky-modules/core/globalify'

import useSlotRoot_lite, * as imports from './useSlotRoot.lite'

declare global {
    const useSlotRoot_lite: typeof imports.default
    type useSlotRoot_lite = typeof imports.default
}

globalify({ useSlotRoot_lite, ...imports })
