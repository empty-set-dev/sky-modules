import * as imports from '.'

declare global {
    type runtime = exports.runtime
    const runtime: typeof exports.runtime
}

namespace exports {
    export type runtime = typeof imports.default
    export const runtime = imports.default
}

Object.assign(global, exports)
