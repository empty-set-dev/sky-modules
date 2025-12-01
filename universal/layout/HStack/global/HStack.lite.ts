import globalify from '@sky-modules/core/globalify'

import HStack, * as imports from '../HStack.lite'

declare global {
    const HStack: typeof imports.default
    type HStack = typeof imports.default
    type HStackProps = imports.HStackProps
}

globalify({ HStack })
