import globalify from '@sky-modules/core/globalify'

import UIContainer, * as imports from '../UIContainer'

declare global {
    const UIContainer: typeof imports.default
    type UIContainer = typeof imports.default
    type UIContainerParameters = imports.UIContainerParameters
}

globalify({ UIContainer })
