import globalify from '@sky-modules/core/globalify'

declare global {
    function switch_thread(): Promise<void>
}

namespace lib {
    define('sky.core.switch_thread', switch_thread)
    export async function switch_thread(): Promise<void> {
        return await new Promise<void>(resolve => resolve()).then(() => {
            //
        })
    }
}

globalify(lib)
