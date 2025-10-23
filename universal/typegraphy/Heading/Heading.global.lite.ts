import globalify from '@sky-modules/core/globalify'

import Heading_lite, * as imports from './Heading.lite'

declare global {
    const Heading_lite: typeof imports.default
    type Heading_lite = typeof imports.default
    type HeadingProps = imports.HeadingProps
}

globalify({ Heading_lite, ...imports })
