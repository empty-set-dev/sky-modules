import globalify from '@sky-modules/core/globalify'

import mitosis, * as imports from '../mitosis'

declare global {
    const mitosis: typeof imports.default
    type mitosis = typeof imports.default
}

globalify({ mitosis })
