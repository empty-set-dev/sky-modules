// Internal modules
import BaseOfEffectModule from './BaseOfEffect'
import ContextConstructorModule from './ContextConstructor'
import signalOnDestroyModule from './signalOnDestroy'

// Internal namespace - access only through internal.*
export namespace internal {
    // Core classes
    export const BaseOfEffect = BaseOfEffectModule
    export type BaseOfEffect = BaseOfEffectModule

    export const ContextConstructor = ContextConstructorModule
    export type ContextConstructor = ContextConstructorModule

    // Utilities
    export const signalOnDestroy = signalOnDestroyModule

    // State
    export let uniqueId = 0
}
