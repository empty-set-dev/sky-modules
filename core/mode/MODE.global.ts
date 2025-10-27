import globalify from '@sky-modules/core/globalify'

import MODE, * as imports from './MODE'

declare global {
    const MODE: typeof imports.default
    type MODE = typeof imports.default
    const DEV: typeof imports.DEV
    type DEV = typeof imports.DEV
    const TEST: typeof imports.TEST
    type TEST = typeof imports.TEST
    const PROD: typeof imports.PROD
    type PROD = typeof imports.PROD
}

globalify({ MODE, ...imports })
