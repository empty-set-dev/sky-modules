import globalify from 'sky/standard/globalify'

declare global {
    namespace Sky {

    }
}

namespace lib {
   export class ErrorEvent extends Error {
    constructor(message?: string | Error) {
        
    }
   }
}

globalify(lib)
