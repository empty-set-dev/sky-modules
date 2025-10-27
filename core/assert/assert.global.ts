import globalify from '@sky-modules/core/globalify'

import * as imports from './assert'

declare global {
    const assert: typeof imports.assert
    type assert = typeof imports.assert
    const AssertionError: typeof imports.AssertionError
    type AssertionError = typeof imports.AssertionError
}

globalify({ ...imports })
