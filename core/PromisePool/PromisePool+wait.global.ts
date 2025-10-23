import globalify from '@sky-modules/core/globalify'
import * as imports from './PromisePool+wait'

declare global {
}

globalify({ ...imports })
