import 'sky/platform/node/global'

import 'sky/standard/global'
import 'sky/utilities/global'
import 'sky/helpers/global'

import 'sky/features/effect/global'

import 'defines/sky.examples.platform.node'
import measurePerformance from 'sky/utilities/measurePerformance'

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
foo

interface SyncEvents {
    update: () => void
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
    measurePerformance('plain', 100000, () => {
        const object = plain(
            'sky.examples.platform.node.TestObject',
            {
                x: optional(Date),
                y: string,
                f: nullish.func<() => void>,
            },
            {
                x: new Date(),
                y: 'test',
            }
        )
    })
    measurePerformance('object', 100000, () => {
        const object = {
            x: new Date(),
            y: 'test',
        }
    })
    // Console.log(object, object.toString(), save(object))
    // const sync = new Sync().on('update', () => {
    //     Console.log('sync get update')
    // })
    // share(object, (): void => {
    //     Console.log('something happen')
    //     sync.update()
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
