import globalify from '@sky-modules/core/globalify'

import Link, * as imports from './Link'

declare global {
    const Link: typeof imports.default
    type Link = typeof imports.default
}

globalify({ Link, ...imports })
