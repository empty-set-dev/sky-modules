import globalify from '@sky-modules/core/globalify'

import Bleed, * as imports from './Bleed.lite'

declare global {
    const Bleed: typeof imports.default
    type Bleed = typeof imports.default
    type BleedProps = imports.BleedProps
}

globalify({ Bleed, ...imports })
