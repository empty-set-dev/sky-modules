import globalify from 'base/globalify'

import * as module from '.'

globalify({ bind: module.default })

declare global {
    function bind<T extends Function>(
        target: object,
        propName: string | symbol,
        descriptor: TypedPropertyDescriptor<T>
    ): TypedPropertyDescriptor<T> | void
}
