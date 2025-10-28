import assume from '#/assume'
import isRuntime from '#/runtime/isRuntime'
import runStaticCode from '#/runtime/runStaticCode'

import { RuntimeSharingError, UnknownSchemaError } from './errors'
import Internal from './internal/internal'

export type { UpdateOfShared, UpdateOfSharedCallback } from './share.types'

export function share(target: Object, callback: UpdateOfSharedCallback): void {
    if (!isRuntime()) {
        throw new RuntimeSharingError()
    }

    assume<Internal.Shared>(target)

    if (target.constructor[Internal.idSymbol] == null) {
        throw new UnknownSchemaError()
    }

    Internal.observe(target, target.constructor.schema, [callback])
}

export function unshare(target: Object, callback: UpdateOfSharedCallback): void {
    assume<Internal.Shared>(target)

    if (target.constructor[Internal.idSymbol] == null) {
        throw new UnknownSchemaError()
    }

    Internal.unobserve(target, target.constructor.schema, [callback])
}

// Defer define calls to avoid circular dependency
runStaticCode(async () => {
    const { default: define } = await import('./define')
    define('sky.core.share', share)
    define('sky.core.unshare', unshare)
})
