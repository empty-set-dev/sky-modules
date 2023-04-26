import globalify from 'base/globalify/defaultly'

import * as local from './defaultly'

globalify({ bind: local.default })

declare global {
    function bind<T extends Function>(
        target: object,
        propName: string | symbol,
        descriptor: TypedPropertyDescriptor<T>
    ): TypedPropertyDescriptor<T> | void
}
