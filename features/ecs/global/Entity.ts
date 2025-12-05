import globalify from '@sky-modules/core/globalify'

import * as imports from '../Entity'

declare global {
    const Entity: typeof imports.Entity
}

globalify({ ...imports })
