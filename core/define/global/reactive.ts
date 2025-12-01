import globalify from '@sky-modules/core/globalify'

import reactive, * as imports from '../reactive'

declare global {
    const reactive: typeof imports.default
    const reactivePropertyDescriptor: typeof imports.reactivePropertyDescriptor
    const reactivePropertyDescriptorMap: typeof imports.reactivePropertyDescriptorMap
}

globalify({ reactive, ...imports })
