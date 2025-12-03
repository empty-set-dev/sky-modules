import globalify from '@sky-modules/core/globalify'

import * as imports from '../Cylindrical'

declare global {
    const Cylindrical: typeof imports.Cylindrical
}

globalify({ ...imports })
