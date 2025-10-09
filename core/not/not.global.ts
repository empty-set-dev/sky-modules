import globalify from '@sky-modules/core/globalify'

import * as lib from './not'

declare global {
    const UndefinedError: typeof lib.UndefinedError
    const notUndefined: typeof lib.notUndefined
    const assertIsNotUndefined: typeof lib.assertIsNotUndefined
    const NullError: typeof lib.NullError
    const notNull: typeof lib.notNull
    const assertIsNotNull: typeof lib.assertIsNotNull
    const NullishError: typeof lib.NullishError
    const notNullish: typeof lib.notNullish
    const assertIsNotNullish: typeof lib.assertIsNotNullish
}

globalify(lib)
