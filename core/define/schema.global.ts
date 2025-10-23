import globalify from '@sky-modules/core/globalify'

import schema, * as imports from './schema'

declare global {
    type schema = imports.default
    const schema: typeof imports.schema
    type schema = imports.schema
}

globalify({ ...imports })
