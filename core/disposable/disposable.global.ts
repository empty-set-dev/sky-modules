import globalify from '@sky-modules/core/globalify'
import * as imports from './disposable.implementation'

declare global {
}

globalify({ ...imports })
