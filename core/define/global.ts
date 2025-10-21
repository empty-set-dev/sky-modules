import '@sky-modules/core/runtime'
import '@sky-modules/core/as'
import '@sky-modules/core/async/global'

import './loadDefines'
import './types'

import * as imports from '.'

declare global {
    type define = typeof imports.define
    const define: typeof imports.define
    const schema: typeof imports.schema & { new (): void }

    interface Object {
        schema: Record<PropertyKey, unknown>
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface Array<T> {
        schema: unknown[]
    }
}


