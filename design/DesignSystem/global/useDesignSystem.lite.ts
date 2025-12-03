import globalify from '@sky-modules/core/globalify'

import useDesignSystem, * as imports from '../useDesignSystem.lite'

declare global {
    const useDesignSystem: typeof imports.default
    type useDesignSystem = typeof imports.default
}

globalify({ useDesignSystem })
