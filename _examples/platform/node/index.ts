import 'sky/platform/node/global'

import 'sky/standard/global'
import 'sky/utilities/global'
import 'sky/helpers/global'

import 'sky/features/effect/global'

import 'defines/sky.examples.platform.node'

@define('sky.examples.platform.node.Foo')
class Foo {
    @number
    x: number = 42

    @string
    y: string = 'hello'

    @object(Foo)
    a: null | Foo = null

    @array(number)
    arr = [1, 2, 3]
}

await runtime

const foo = new Foo()

let uniqueId = 1000
const idSymbol = Symbol('id')

function plain<T extends object>(
    type: string,
    description: T,
    object: Plain<T> & object
): Plain<T> {
    if (!extends_type<T & { prototype: {} }>(description)) {
        return null!
    }

    if (description.prototype) {
        return object
    }

    Object.keys(description).forEach(k => {
        console.log('!', k, description[k as keyof T])
    })

    description.prototype = {}

    Object.setPrototypeOf(object, description.prototype)

    return object
}

define('sky.examples.platform.node.share()')
function share(target: Object, callback: () => void): void {
    if (!extends_type<{ [idSymbol]: number }>(target)) {
        return null!
    }

    if (target[idSymbol] == null) {
        Object.defineProperty(target, idSymbol, {
            enumerable: false,
            value: ++uniqueId,
            configurable: false,
            writable: false,
        })
    }

    target
    callback

    const prototype = Object.getPrototypeOf(target)

    if (prototype === Object.prototype) {
        throw Error('try sync unknown object')
    }

    callback()
}

interface SyncEvents {
    update: () => void
}
interface Sync<T> extends EventEmitter<SyncEvents> {}
@mixin(EventEmitter)
class Sync<T> {
    value?: T

    constructor() {
        EventEmitter.super(this)
    }

    update(): void {
        this.emit('update')
    }
}

{
    const object = plain(
        'sky.examples.platform.node.TestObject',
        {
            x: optional(Date),
            y: string,
        },
        {
            y: 'test',
        }
    )
    const sync = new Sync().on('update', () => {
        console.log('sync get update')
    })
    share(object, (): void => {
        console.log('something happen')
        sync.update()
    })

    const array = plain('sky.examples.platform.node.TestArray', [string], ['1', '2', '3'])

    share(array, (): void => {
        console.log('something happen')
        sync.update()
    })
}

// import 'sky/features/reactive/_reactive'

// class Test {
//     static context = true

//     readonly effect: Effect

//     constructor(deps: EffectDeps) {
//         this.effect = new Effect(deps, this)
//     }
// }

// const root = new EffectsRoot()
// const test = new Test(root)
// test

// interface Foo extends EventEmitter, Visibility {}
// @mixin(EventEmitter)
// @mixin(Visibility)
// class Foo {
//     readonly effect: Effect
//     constructor(deps: EffectDeps) {
//         EventEmitter.super(this)
//         Visibility.super(this)

//         this.effect = new Effect(deps, this)
//     }
// }

// const foo = new Foo(root)
// new Effect(() => {
//     function test(): void {
//         Console.log('test')
//     }

//     foo.on('test', test)
//     return (): void => {
//         foo.off('test', test)
//     }
// }, foo.effect)

// foo.emit('test')
// foo.effect.destroy()
// foo.emit('test')

// Console.log(foo.visible, root)
