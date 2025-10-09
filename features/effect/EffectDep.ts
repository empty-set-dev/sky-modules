import ContextConstructor from './ContextConstructor'
import internal from './internal'

type EffectDep = internal.BaseOfEffect | [internal.BaseOfEffect, ContextConstructor]
export default EffectDep
