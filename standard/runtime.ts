import './async'
import './switch_thread'

import globalify from 'sky/utilities/globalify'

declare global {
    var isRuntime: boolean
    type runtime = typeof runtime
    const runtime: Promise<void>
}

namespace lib {
    export const runtime = switch_thread()

    global.isRuntime = false
    async(async () => {
        await runtime
        global.isRuntime = true
    })
}

globalify(lib)
