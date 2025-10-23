import globalify from '@sky-modules/core/globalify'

import Tag, * as imports from './Tag'

declare global {
    const Tag: typeof imports.default
    type Tag = typeof imports.default
    type TagProps = imports.TagProps
}

globalify({ Tag, ...imports })
