import BaseOfEffectModule from './BaseOfEffect'
import signalOnDestroyModule from './changeDisposeStatus'

export default internal
namespace internal {
    export const BaseOfEffect = BaseOfEffectModule
    export type BaseOfEffect = BaseOfEffectModule

    export const signalOnDestroy = signalOnDestroyModule

    export let uniqueId = 0
}
