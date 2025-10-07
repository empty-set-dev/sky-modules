// Default exports
export { default } from './_Effect'
export { default as EffectRoot } from './EffectRoot'
export { default as ContextConstructor } from './ContextConstructor'

// Internal namespace (access only through internal.*)
export { internal } from './internal'

// Global imports (side effects)
import './global'