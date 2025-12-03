import globalify from '@sky-modules/core/globalify'

import MouseController, * as imports from '../MouseController'

declare global {
    const MouseController: typeof imports.default
    type MouseController = typeof imports.default
    type MouseControllerParameters = imports.MouseControllerParameters
}

globalify({ MouseController })
