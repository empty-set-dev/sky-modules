import globalify from '@sky-modules/core/globalify'

import * as imports from './types'

declare global {
    const read: typeof imports.read
    const write: typeof imports.write
    const secret: typeof imports.secret
    const boolean: typeof imports.boolean
    const number: typeof imports.number
    const string: typeof imports.string
    const object: typeof imports.object
    const array: typeof imports.array
    const func: typeof imports.func
    const optional: typeof imports.optional
    const nullable: typeof imports.nullable
    const nullish: typeof imports.nullish
    type func = typeof imports.func
}

globalify({ ...imports })
