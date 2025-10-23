import globalify from '@sky-modules/core/globalify'

import usePopover_lite, * as imports from './usePopover.lite'

declare global {
    const usePopover_lite: typeof imports.default
    type usePopover_lite = typeof imports.default
    type UsePopoverParameters = imports.UsePopoverParameters
}

globalify({ usePopover_lite, ...imports })
