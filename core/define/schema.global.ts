import globalify from '@sky-modules/core/globalify'
import schema, * as imports from './schema'

declare global {
    type schema = typeof imports.default
    const schema: typeof imports.default
    const schema: typeof imports.schema
}

globalify({ schema, ...imports })
