import globalify from 'sky/standard/globalify'

import idle, * as lib from '.'

globalify({ idle, ...lib })

declare global {
    interface IdleParameters extends lib.IdleParameters {}
    const idle: typeof lib.default
}
