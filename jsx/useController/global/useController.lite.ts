import globalify from '@sky-modules/core/globalify'

import useController, * as imports from '../useController.lite'

declare global {
    const useController: typeof imports.default
    type useController = typeof imports.default
    type Controller = imports.Controller
}

globalify({ useController })
