import globalify from '@sky-modules/core/globalify'
import Class, * as imports from './Class'

declare global {
    type Class = typeof imports.default
    const Class: typeof imports.default
}

globalify({ Class, ...imports })
