import globalify from '@sky-modules/core/globalify'

import runStaticCode, * as imports from './runStaticCode'

declare global {
    const runStaticCode: typeof imports.default
    type runStaticCode = typeof imports.default
}

globalify({ runStaticCode })
