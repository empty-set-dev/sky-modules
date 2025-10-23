import globalify from '@sky-modules/core/globalify'

import HStack_lite, * as imports from './HStack.lite'

declare global {
    const HStack_lite: typeof imports.default
    type HStack_lite = typeof imports.default
    type HStackProps = imports.HStackProps
}

globalify({ HStack_lite, ...imports })
