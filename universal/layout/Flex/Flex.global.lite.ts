import globalify from '@sky-modules/core/globalify'

import Flex_lite, * as imports from './Flex.lite'

declare global {
    const Flex_lite: typeof imports.default
    type Flex_lite = typeof imports.default
    type FlexProps = imports.FlexProps
}

globalify({ Flex_lite, ...imports })
