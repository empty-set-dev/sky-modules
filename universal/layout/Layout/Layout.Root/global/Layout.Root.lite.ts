import globalify from '@sky-modules/core/globalify'

import LayoutRoot, * as imports from '../Layout.Root.lite'

declare global {
    const LayoutRoot: typeof imports.default
    type LayoutRoot = typeof imports.default
    type LayoutRootProps<T extends TagName = 'div'> = imports.LayoutRootProps<T>
}

globalify({ LayoutRoot })
