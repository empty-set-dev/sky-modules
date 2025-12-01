import globalify from '@sky-modules/core/globalify'

import AspectRatio, * as imports from '../AspectRatio.lite'

declare global {
    const AspectRatio: typeof imports.default
    type AspectRatio = typeof imports.default
    type AspectRatioProps = imports.AspectRatioProps
}

globalify({ AspectRatio })
