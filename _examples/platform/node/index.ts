import 'sky/platform/node/global'

import 'defines/sky.examples.platform.node'

import 'sky/standard/global'
import 'sky/utilities/global'
import 'sky/helpers/global'

import 'sky/features/effect/global'

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
Foo

define('sky.examples.platform.node.testFunction', testFunction)
function testFunction(): void {
    Console.log('test function')
}

const secret: number & Function = 0 as number & Function
const read: number & Function = 0 as number & Function
const read_write: number & Function = 1 as number & Function

const ObjectSchema = define('sky.examples.platform.node.ObjectSchema', {
    x: read(optional(number)),
    y: read_write(string),
    f: read(nullish.func<() => void>),
    z: read({
        a: number,
        b: number,
    }),
    ololo: secret(string),
})

function onUpdate(update: unknown, watcher: unknown) {}

await runtime

// const foo = new Foo()

// share(foo, (update): void => {
//     Console.log('foo updated', update)
// })

// reaction(() => {
//     console.log(foo.x + foo.arr[0])
//     // foo.x = 15
//     reaction(() => {
//         console.log('inner reaction')
//     })
// })
// foo.x = 42
// foo.a = foo
// foo.constructor

// interface SyncEvents {
//     update: () => void
// }

// interface Sync<T> extends EventEmitter<SyncEvents> {}
// @mixin(EventEmitter)
// class Sync<T> {
//     value?: T

//     constructor() {
//         EventEmitter.super(this)
//     }

//     update(): void {
//         this.emit('update')
//     }
// }

{
    // measurePerformance('plain', 1000000, () => {
    //     const object = plain(
    //         'sky.examples.platform.node.TestObject',
    //         {
    //             x: optional(number),
    //             y: string,
    //             z: {
    //                 a: number,
    //                 b: number,
    //             },
    //         },
    //         {
    //             x: 42,
    //             y: 'test',
    //             z: {
    //                 a: 42,
    //                 b: 42,
    //             },
    //         }
    //     )
    //     // object.x = 42
    //     // object.y = 'test'
    // })
    // measurePerformance('object', 1000000, () => {
    //     const object2 = {
    //         x: 42,
    //         y: 'test',
    //     }
    // })
    const object = plain(ObjectSchema, {
        x: 42,
        y: 'test',
        f: testFunction,
        z: {
            a: 42,
            b: 42,
        },
    })
    Console.log(object, save(object))
    // const sync = new Sync().on('update', () => {
    //     Console.log('sync get update')
    // })
    // share(object, (): void => {
    //     Console.log('something happen')
    //     // sync.update()
    // })
    // const array = plain('sky.examples.platform.node.TestArray', [string], ['1', '2', '3'])
    // share(array, (): void => {
    //     Console.log('something happen')
    //     sync.update()
    // })
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
