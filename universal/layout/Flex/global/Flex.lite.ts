import globalify from '@sky-modules/core/globalify'

import Flex, * as imports from '../Flex.lite'

declare global {
    const Flex: typeof imports.default
    type Flex = typeof imports.default
    type FlexProps = imports.FlexProps
}

globalify({ Flex })
