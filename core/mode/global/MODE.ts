import globalify from '@sky-modules/core/globalify'

import MODE, * as imports from '../MODE'

declare global {
    const MODE: typeof imports.default
    const DEV: typeof imports.DEV
    const TEST: typeof imports.TEST
    const PROD: typeof imports.PROD
}

globalify({ MODE, ...imports })
