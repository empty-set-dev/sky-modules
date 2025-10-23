import globalify from '@sky-modules/core/globalify'
import reactivePropertyDescriptors, * as imports from './reactivePropertyDescriptors'

declare global {
    type reactivePropertyDescriptors = typeof imports.default
    const reactivePropertyDescriptors: typeof imports.default
}

globalify({ reactivePropertyDescriptors, ...imports })
