import * as BaseOfEffectModule from './BaseOfEffect'
import * as signalOnDestroyModule from './signalOnDestroy'

export default internal
namespace internal {
    export const BaseOfEffect = BaseOfEffectModule.default
    export const signalOnDestroy = signalOnDestroyModule.default
}
