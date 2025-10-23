import globalify from '@sky-modules/core/globalify'
import * as imports from './not'

declare global {
    const notUndefined: typeof imports.notUndefined
    const assertIsNotUndefined: typeof imports.assertIsNotUndefined
    const notNull: typeof imports.notNull
    const assertIsNotNull: typeof imports.assertIsNotNull
    const notNullish: typeof imports.notNullish
    const assertIsNotNullish: typeof imports.assertIsNotNullish
    const NullError: typeof imports.NullError
    const NullishError: typeof imports.NullishError
    const UndefinedError: typeof imports.UndefinedError
}

globalify({ ...imports })
