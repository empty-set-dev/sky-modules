import globalify from '@sky-modules/core/globalify'
import reaction, * as imports from './reaction'

declare global {
    const reaction: typeof imports.default
}

globalify({ reaction, ...imports })
