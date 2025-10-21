import globalify from '@sky-modules/core/globalify'

import * as imports from '.'

declare global {
    const Class: typeof imports.default
}

globalify({ Class: imports.default })
