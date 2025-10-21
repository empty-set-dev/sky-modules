import define from '../define'
import globalify from '../globalify'

declare global {
    function switch_thread(): Promise<void>
}

namespace lib {
    define('sky.core.switch_thread', switch_thread)
    export async function switch_thread(): Promise<void> {
        // Yield to event loop to allow other tasks to execute
        await Promise.resolve()
    }
}

globalify(lib)
