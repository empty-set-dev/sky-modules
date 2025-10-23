import globalify from '@sky-modules/core/globalify'
import * as imports from './measures.example'

declare global {
}

globalify({ ...imports })
