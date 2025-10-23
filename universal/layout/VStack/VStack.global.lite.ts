import globalify from '@sky-modules/core/globalify'

import VStack_lite, * as imports from './VStack.lite'

declare global {
    const VStack_lite: typeof imports.default
    type VStack_lite = typeof imports.default
    type VStackProps = imports.VStackProps
}

globalify({ VStack_lite, ...imports })
