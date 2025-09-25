import 'defines/sky/standard/switch_thread'

import globalify from 'sky/standard/globalify'

declare global {
    function switch_thread(): Promise<void>
}

namespace lib {
    define('sky.standard.switch_thread', switch_thread)
    export async function switch_thread(): Promise<void> {
        return await new Promise<void>(resolve => resolve()).then(() => {
            //
        })
    }
}

globalify(lib)
