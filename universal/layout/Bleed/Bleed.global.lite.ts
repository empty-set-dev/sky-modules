import globalify from '@sky-modules/core/globalify'

import Bleed_lite, * as imports from './Bleed.lite'

declare global {
    const Bleed_lite: typeof imports.default
    type Bleed_lite = typeof imports.default
    type BleedProps = imports.BleedProps
}

globalify({ Bleed_lite, ...imports })
