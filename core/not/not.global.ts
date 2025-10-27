import globalify from '@sky-modules/core/globalify'

import * as imports from './not'

declare global {
    const notUndefined: typeof imports.notUndefined
    type notUndefined = typeof imports.notUndefined
    const assertIsNotUndefined: typeof imports.assertIsNotUndefined
    type assertIsNotUndefined = typeof imports.assertIsNotUndefined
    const notNull: typeof imports.notNull
    type notNull = typeof imports.notNull
    const assertIsNotNull: typeof imports.assertIsNotNull
    type assertIsNotNull = typeof imports.assertIsNotNull
    const notNullish: typeof imports.notNullish
    type notNullish = typeof imports.notNullish
    const assertIsNotNullish: typeof imports.assertIsNotNullish
    type assertIsNotNullish = typeof imports.assertIsNotNullish
}

globalify({ ...imports })
