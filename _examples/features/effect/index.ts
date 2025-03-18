import '#/imports'

class App extends EffectsRoot {}

class Foo extends Sprite {
    onGlobalMouseDown(ev: MouseDownEvent): void {
        // eslint-disable-next-line no-console
        console.log(ev)
    }
}

const app = new App()

const foo = new Foo(app)
foo.view.position.x = 100
foo.view.position.y = 100

app.emit('onGlobalMouseDown', {
    x: 42,
    y: 42,
})
