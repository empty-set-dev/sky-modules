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
}

await runtime

const foo = new Foo()

function sync(target: Object, callback: () => void): void {
    target
    callback

    const prototype = Object.getPrototypeOf(target)

    if (prototype) {
        //
    }
}

{
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const object: any = {}
    sync(object, (): void => {
        console.log('something happen')
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
