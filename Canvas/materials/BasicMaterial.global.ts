import globalify from '@sky-modules/core/globalify'

import * as imports from './BasicMaterial'

declare global {
    const BasicMaterial: typeof imports.BasicMaterial
}

globalify({ ...imports })
