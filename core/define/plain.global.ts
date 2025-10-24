import globalify from '@sky-modules/core/globalify'

import plain, * as imports from './plain'

declare global {
    const plain: typeof imports.default
    type plain = typeof imports.default
    type PlainFunctionArgument = imports.PlainFunctionArgument
    type Plain = imports.Plain
}

globalify({ plain })
