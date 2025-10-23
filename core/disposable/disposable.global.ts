import globalify from '@sky-modules/core/globalify'
import * as imports from './disposable'

declare global {
}

globalify({ ...imports })
