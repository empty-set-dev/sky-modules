import globalify from '@sky-modules/core/globalify'

import * as imports from './errors'

declare global {
    const UndefinedError: typeof imports.UndefinedError
    type UndefinedError = typeof imports.UndefinedError
    const NullError: typeof imports.NullError
    type NullError = typeof imports.NullError
    const NullishError: typeof imports.NullishError
    type NullishError = typeof imports.NullishError
}

globalify({ ...imports })
