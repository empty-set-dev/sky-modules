import globalify from 'sky/standard/globalify'

import * as lib from '.'

globalify({ EventEmitter: lib.default })

declare global {
    class EventEmitter<T extends { [K in keyof T]: T[K] }> extends lib.default<T> {}
}
