import globalify from '@sky-modules/core/globalify'

import Col_lite, * as imports from './Col.lite'

declare global {
    const Col_lite: typeof imports.default
    type Col_lite = typeof imports.default
    type ColProps = imports.ColProps
}

globalify({ Col_lite, ...imports })
