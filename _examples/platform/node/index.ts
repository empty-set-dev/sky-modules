import 'sky/platform/node/global'
import 'sky/standard/global'
import 'sky/utilities/global'
import 'sky/helpers/global'
import 'sky/features/effect/global'

// class Test {
//     static context = true

//     readonly effect: Effect

//     constructor(deps: EffectDeps) {
//         this.effect = new Effect(deps, this)
//     }
// }

const root = new EffectsRoot()
// const test = new Test(root)
// test

interface Foo extends EventEmitter, Visibility {}
@mixin(EventEmitter)
@mixin(Visibility)
class Foo {
    readonly effect: Effect
    constructor(deps: EffectDeps) {
        EventEmitter.super(this)
        Visibility.super(this)

        this.effect = new Effect(deps, this)
    }
}

const foo = new Foo(root)
new Effect(() => {
    function test(): void {
        Console.log('test')
    }

    foo.on('test', test)
    return (): void => {
        foo.off('test', test)
    }
}, foo.effect)

foo.emit('test')
foo.effect.destroy()
foo.emit('test')

Console.log(foo.visible)
