import globalify from '@sky-modules/core/globalify'

import DesignSystemProvider, * as imports from '../DesignSystemProvider.lite'

declare global {
    const DesignSystemProvider: typeof imports.default
    type DesignSystemProvider = typeof imports.default
    type DesignSystemProviderProps = imports.DesignSystemProviderProps
}

globalify({ DesignSystemProvider })
