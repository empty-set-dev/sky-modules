import globalify from '@sky-modules/core/globalify'
import DeepPartial, * as imports from './DeepPartial'

declare global {
    type DeepPartial = typeof imports.default
    const DeepPartial: typeof imports.default
}

globalify({ DeepPartial, ...imports })
