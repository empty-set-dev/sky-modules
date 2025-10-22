import globalify from '../globalify'

import * as imports from '.'

declare global {
    const UndefinedError: typeof imports.UndefinedError
    const notUndefined: typeof imports.notUndefined
    const assertIsNotUndefined: typeof imports.assertIsNotUndefined
    const NullError: typeof imports.NullError
    const notNull: typeof imports.notNull
    const assertIsNotNull: typeof imports.assertIsNotNull
    const NullishError: typeof imports.NullishError
    const notNullish: typeof imports.notNullish
    const assertIsNotNullish: typeof imports.assertIsNotNullish
}

globalify(imports)
