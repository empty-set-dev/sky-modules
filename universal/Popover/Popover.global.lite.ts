import globalify from '@sky-modules/core/globalify'

import Popover_lite, * as imports from './Popover.lite'

declare global {
    const Popover_lite: typeof imports.default
    type Popover_lite = typeof imports.default
    type PopoverProps = imports.PopoverProps
}

globalify({ Popover_lite, ...imports })
