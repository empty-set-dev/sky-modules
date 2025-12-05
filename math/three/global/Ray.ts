import globalify from '@sky-modules/core/globalify'

import * as imports from '../Ray'

declare global {
    const Ray: typeof imports.Ray
}

globalify({ ...imports })
