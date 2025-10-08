import ContextConstructor from './ContextConstructor'
import internal from './internal'

type EffectDeps = internal.BaseOfEffect | [internal.BaseOfEffect, ContextConstructor]
export default EffectDeps
