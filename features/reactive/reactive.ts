import { ReactiveEvent } from './events'

export function reactive(target: Object, propertyKey: string | symbol): void
export function reactive<T>(
    reaction: (this: T) => unknown
): (target: Object, propertyKey: string | symbol) => void
export function reactive(...args: unknown[]): unknown {
    console.log('--->', ...args)
    return reactive
}

export function save(target: object): string {
    const prototype = Object.getPrototypeOf(target)
    Object.keys(target)
}

export function load<T>(json: string, target?: T): void {}

export function observe(target: Object, listener: (event: ReactiveEvent) => void) {}

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
