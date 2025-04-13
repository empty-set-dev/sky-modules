import '#/client/imports'

class App {
    static context = true

    readonly root = new EffectsRoot()
}

class Foo {
    readonly sprite: Sprite

    constructor(deps: EffectDeps) {
        this.sprite = new Sprite(deps)
    }

    onGlobalMouseDown(ev: MouseDownEvent): void {
        // eslint-disable-next-line no-console
        console.log(ev)
    }
}

const app = new App()

const foo = new Foo(app.root)
foo.sprite.position.x = 100
foo.sprite.position.y = 100

app.root.emit('onGlobalMouseDown', {
    x: 42,
    y: 42,
})
