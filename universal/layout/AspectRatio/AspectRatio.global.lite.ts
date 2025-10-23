import globalify from '@sky-modules/core/globalify'

import AspectRatio_lite, * as imports from './AspectRatio.lite'

declare global {
    const AspectRatio_lite: typeof imports.default
    type AspectRatio_lite = typeof imports.default
    type AspectRatioProps = imports.AspectRatioProps
}

globalify({ AspectRatio_lite, ...imports })
