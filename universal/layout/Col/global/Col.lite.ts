import globalify from '@sky-modules/core/globalify'

import Col, * as imports from '../Col.lite'

declare global {
    const Col: typeof imports.default
    type Col = typeof imports.default
    type ColProps<T extends BoxAs = 'div'> = imports.ColProps<T>
}

globalify({ Col })
