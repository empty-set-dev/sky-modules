import globalify from '@sky-modules/core/globalify'

import * as imports from '../wrapText'

declare global {
    const wrapText: typeof imports.wrapText
    type WrapTextOptions = imports.WrapTextOptions
}

globalify({ ...imports })
