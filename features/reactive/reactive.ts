import { ReactiveEvent } from './events'

/**
 * Decorator that makes a class property reactive.
 *
 * When a reactive property changes, it triggers events that can be observed.
 * This decorator can be used with or without a custom reaction function.
 *
 * @param target The class containing the property (when used as simple decorator)
 * @param propertyKey The property name to make reactive
 *
 * @example Simple reactive property
 * ```typescript
 * class Counter {
 *     @reactive
 *     count: number = 0
 * }
 * ```
 *
 * @example Reactive with custom reaction
 * ```typescript
 * class Temperature {
 *     @reactive<Temperature>(self => self.celsius)
 *     fahrenheit!: number
 *
 *     celsius: number = 0
 * }
 * ```
 */
export function reactive(target: Object, propertyKey: string | symbol): void
/**
 * Creates a reactive decorator with a custom reaction function.
 *
 * @param reaction Function that computes the reactive value based on other properties
 * @returns Decorator function
 */
export function reactive<T>(
    reaction: (this: T) => unknown
): (target: Object, propertyKey: string | symbol) => void
export function reactive(...args: unknown[]): unknown {
    console.log('--->', ...args)
    return reactive
}

/**
 * Serializes an object to JSON, preserving its reactive state.
 *
 * @param target The object to serialize
 * @returns JSON string representation
 *
 * @example
 * ```typescript
 * const state = { count: 42, name: 'Test' }
 * const json = save(state)
 * ```
 */
export function save(target: object): string {
    const prototype = Object.getPrototypeOf(target)
    Object.keys(target)
}

/**
 * Deserializes an object from JSON, restoring its reactive state.
 *
 * @param json JSON string to deserialize
 * @param target Optional existing object to populate
 *
 * @example
 * ```typescript
 * const json = '{"count":42,"name":"Test"}'
 * const state = load<State>(json)
 * ```
 */
export function load<T>(json: string, target?: T): void {}

/**
 * Registers a listener for reactive events on an object.
 *
 * The listener will be called whenever reactive properties on the target change.
 *
 * @param target The object to observe
 * @param listener Callback function that receives reactive events
 *
 * @example
 * ```typescript
 * const state = { count: 0 }
 * observe(state, (event) => {
 *     console.log('State changed:', event.type)
 * })
 * ```
 */
export function observe(target: Object, listener: (event: ReactiveEvent) => void) {}

/**
 * Manually triggers an update cycle for reactive properties.
 *
 * This can be used to force re-evaluation of computed reactive values.
 *
 * @example
 * ```typescript
 * // Make changes
 * state.count++
 * state.name = 'Updated'
 *
 * // Force update
 * update()
 * ```
 */
export function update(): void {}

//
@define('sky.features.reactive.Foo')
class Foo {
    // @reactive<Foo>(self => self.y)
    // x!: number

    @reactive
    y = 42

    boo(): void {
        console.log('Foo: boo')
    }
}

const foo = new Foo()
observe(foo, (event: ReactiveEvent) => {
    console.log(event.type)
})

console.log(save([1, 2, 3]))
