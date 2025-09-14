import globalify from 'sky/standard/globalify'
iAm('sky.react.Plugin', import('./Plugin.global'))

declare global {
    interface Modules {
        'sky.react.Plugin': typeof import('./Plugin.global')
    }
}
declare global {
    namespace Sky {
        namespace React {
            const Plugin: typeof lib.Plugin
        }
    }
}

namespace lib {
    export class Plugin<P> {
        provider?: P
    }
}

globalify.namespace('Sky.React', lib)
