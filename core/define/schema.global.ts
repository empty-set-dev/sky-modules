import globalify from '@sky-modules/core/globalify'

import schema, * as imports from './schema'

declare global {
    const schema: typeof imports.default
    type schema = typeof imports.default
    const schema: typeof imports.schema
    type schema = imports.schema
}

globalify({ schema, ...imports })
