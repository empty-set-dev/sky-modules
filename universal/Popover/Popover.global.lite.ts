import globalify from '@sky-modules/core/globalify'

import Popover, * as imports from './Popover.lite'

declare global {
    const Popover: typeof imports.default
    type Popover = typeof imports.default
    type PopoverProps = imports.PopoverProps
}

globalify({ Popover, ...imports })
