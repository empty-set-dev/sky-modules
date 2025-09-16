export { default } from './Foo'

// Export JSX renderers
export { default as MinimalJSX } from './minimal-jsx.svelte'
export { default as SafeJSX } from './safe-jsx.svelte'

// Export pre-compiled clean Svelte components (NO runtime overhead!)
export { default as FooClean } from './FooCompiledClean.svelte'
export { default as FooAuto } from './FooAutoCompiled.svelte'
