import globalify from '@sky-modules/core/globalify'
import * as imports from './events'

declare global {
    const MouseButton: typeof imports.MouseButton
}

globalify({ ...imports })
