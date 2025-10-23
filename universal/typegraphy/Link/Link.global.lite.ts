import globalify from '@sky-modules/core/globalify'

import Link_lite, * as imports from './Link.lite'

declare global {
    const Link_lite: typeof imports.default
    type Link_lite = typeof imports.default
    type LinkProps = imports.LinkProps
}

globalify({ Link_lite, ...imports })
