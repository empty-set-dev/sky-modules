import globalify from '@sky-modules/core/globalify'

import HTML_TAGS, * as imports from '../HTML_TAGS'

declare global {
    const HTML_TAGS: typeof imports.default
    type HTML_TAGS = typeof imports.default
}

globalify({ HTML_TAGS })
