import globalify from '@sky-modules/core/globalify'
import * as imports from './PromisePool+run'

declare global {
}

globalify({ ...imports })
