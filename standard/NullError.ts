import globalify from 'sky/utilities/globalify'

declare global {
    class NullError extends lib.NullError {}
}

namespace lib {
    export class NullError extends Error {
        constructor() {
            super('null')
        }
    }
}

globalify(lib)
