import globalify from '@sky-modules/core/globalify'

import Bleed, * as imports from '../Bleed.lite'

declare global {
    const Bleed: typeof imports.default
    type Bleed = typeof imports.default
    type BleedProps<T extends BoxAs = 'div'> = imports.BleedProps<T>
}

globalify({ Bleed })
