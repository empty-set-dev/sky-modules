import globalify from '@sky-modules/core/globalify'

import Heading, * as imports from '../Heading.lite'

declare global {
    const Heading: typeof imports.default
    type Heading = typeof imports.default
    type HeadingProps = imports.HeadingProps
}

globalify({ Heading })
