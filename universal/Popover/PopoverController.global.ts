import globalify from '@sky-modules/core/globalify'

import PopoverController, * as imports from './PopoverController'

declare global {
    const PopoverController: typeof imports.default
    type PopoverController = typeof imports.default
}

globalify({ PopoverController, ...imports })
