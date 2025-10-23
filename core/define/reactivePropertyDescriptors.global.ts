import globalify from '@sky-modules/core/globalify'

import reactivePropertyDescriptors, * as imports from './reactivePropertyDescriptors'

declare global {
    const reactivePropertyDescriptors: typeof imports.default
    type reactivePropertyDescriptors = typeof imports.default
}

globalify({ reactivePropertyDescriptors, ...imports })
