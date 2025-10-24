import globalify from '@sky-modules/core/globalify'

import save, * as imports from './save'

declare global {
    const save: typeof imports.default
    type save = typeof imports.default
}

globalify({ save })
