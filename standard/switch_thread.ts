import globalify from 'sky/utilities/globalify'

declare global {
    function switch_thread(): Promise<void>
}

namespace lib {
    export async function switch_thread(): Promise<void> {
        return await new Promise(resolve => setTimeout(resolve))
    }
}

globalify(lib)
