import * as BaseOfEffectModule from './BaseOfEffect'
import * as ContextConstructorModule from './ContextConstructor'
import * as signalOnDestroyModule from './signalOnDestroy'

export default internal
namespace internal {
    export type BaseOfEffect = BaseOfEffectModule.default
    export const BaseOfEffect = BaseOfEffectModule.default

    export type ContextConstructor = ContextConstructorModule.default

    export const signalOnDestroy = signalOnDestroyModule.default

    export let uniqueId = 0
}
