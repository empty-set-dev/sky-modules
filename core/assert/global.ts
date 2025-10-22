import globalify from '../globalify'

import * as imports from './assert'

declare global {
    class AssertionError extends imports.AssertionError {}
    const assert: typeof imports.assert
}

globalify(imports)
