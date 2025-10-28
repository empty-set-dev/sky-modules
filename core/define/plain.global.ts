import globalify from '@sky-modules/core/globalify'

import plain, * as imports from './plain'

declare global {
    const plain: typeof imports.default
    type PlainFunctionArgument<T> = imports.PlainFunctionArgument<T>
    type Plain<T> = imports.Plain<T>
}

globalify({ plain })
