import { ReactiveEvent } from './_events'

const classes: Record<string, Class> = {}
const properties: Record<string, (...args: unknown[]) => unknown> = {}
const methods: Record<string, (...args: unknown[]) => unknown> = {}

export function define(name: string): (target: Object) => void {
    return function (target: Object): void {
        if (isRuntime) {
            throw Error('runtime define')
        }

        console.log(name)

        console.log(Object.getOwnPropertyDescriptors(target.prototype))
    }
}

export function reactive(target: Object, propertyKey: string | symbol): void {}

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
    @reactive
    x = 42

    boo(): void {
        console.log('Foo: boo')
    }
}

const foo = new Foo()
observe(foo)

console.log(save([1, 2, 3]))
