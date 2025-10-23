import globalify from '@sky-modules/core/globalify'

import * as imports from './assert'

declare global {
    const assert: typeof imports.assert
    const AssertionError: typeof imports.AssertionError
}

globalify({ ...imports })
