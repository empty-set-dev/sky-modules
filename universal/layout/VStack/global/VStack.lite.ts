import globalify from '@sky-modules/core/globalify'

import VStack, * as imports from '../VStack.lite'

declare global {
    const VStack: typeof imports.default
    type VStack = typeof imports.default
    type VStackProps<T extends TagName = 'div'> = imports.VStackProps<T>
}

globalify({ VStack })
