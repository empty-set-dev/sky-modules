import globalify from '@sky-modules/core/globalify'

import component, * as imports from '../Box'

declare global {
    const component: typeof imports.default
    type component = typeof imports.default
}

globalify({ component })
