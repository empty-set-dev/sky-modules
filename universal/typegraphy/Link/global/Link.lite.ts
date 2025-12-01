import globalify from '@sky-modules/core/globalify'

import Link, * as imports from '../Link.lite'

declare global {
    const Link: typeof imports.default
    type Link = typeof imports.default
    type LinkProps = imports.LinkProps
}

globalify({ Link })
