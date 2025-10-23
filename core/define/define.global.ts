import globalify from '@sky-modules/core/globalify'
import define, * as imports from './define'

declare global {
    type define = typeof imports.default
    const define: typeof imports.default
}

globalify({ define, ...imports })
