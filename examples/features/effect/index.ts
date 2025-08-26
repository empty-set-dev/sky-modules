import '#/imports'

class App {
    static context = true

    readonly root = new EffectsRoot()
}

interface Foo extends Enability {}
@enability
class Foo {
    readonly effect: Effect
    readonly sprite: Sprite

    constructor(deps: EffectDeps) {
        Enability.super(this)
        this.effect = new Effect(deps, this)
        this.sprite = new Sprite(this.effect)
    }

    onGlobalMouseDown(ev: Sky.MouseDownEvent): void {
        // eslint-disable-next-line no-console
        console.log(ev)
    }
}

const app = new App()

const foo = new Foo(app.root)
foo.sprite.position.x = 100
foo.sprite.position.y = 100

app.root.emit('onGlobalMouseDown', {
    isCaptured: false,
    x: 42,
    y: 42,
})
