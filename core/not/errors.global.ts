import globalify from '@sky-modules/core/globalify'
import * as imports from './errors'

declare global {
    const UndefinedError: typeof imports.UndefinedError
    const NullError: typeof imports.NullError
    const NullishError: typeof imports.NullishError
}

globalify({ ...imports })
