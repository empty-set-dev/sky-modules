import Effect from '../Effect'
import EffectDep from '../EffectDep'

import * as BaseOfEffectModule from './BaseOfEffect'
import * as changeDisposeStatusModule from './changeDisposeStatus'

export default internal
namespace internal {
    export const BaseOfEffect = BaseOfEffectModule.default
    export type BaseOfEffect = BaseOfEffectModule.default

    export const changeDisposeStatus = changeDisposeStatusModule.default

    export const RESOLVED = Promise.resolve()

    export let uniqueId = 0

    export enum PendingOperationType {
        ADD_PARENT,
        REMOVE_PARENT,
        ADD_DEPENDENCY,
        REMOVE_DEPENDENCY,
        ADD_CONTEXT,
        REMOVE_CONTEXT,
    }
    export interface ParentOperationData {
        child: Effect
        parent: BaseOfEffect
    }
    export interface DependencyOperationData {
        dependency: EffectDep
        effect: Effect
    }
    export interface ContextOperationData {
        context: object
        target: BaseOfEffect
    }
}
