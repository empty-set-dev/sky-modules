import globalify from '@sky-modules/core/globalify'

import plain, * as imports from './plain'

declare global {
    const plain: typeof imports.default
    type PlainFunctionArgument = typeof imports.PlainFunctionArgument
    type Plain = typeof imports.Plain
}

globalify({ plain, ...imports })
