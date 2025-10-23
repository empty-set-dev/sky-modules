import globalify from '@sky-modules/core/globalify'
import array, * as imports from './array'

declare global {
    type array = typeof imports.default
    const array: typeof imports.default
}

globalify({ array, ...imports })
