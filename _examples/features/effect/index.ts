import '#/imports'

class App extends EffectsRoot {}

class Foo extends Sprite {
    mouseDown(ev: MouseDownEvent): void {
        // eslint-disable-next-line no-console
        console.log(e)
    }
}

const app = new App()

const foo = new Foo(app)
foo.position.x = 100
foo.position.y = 100

app.emit('mouseDown', {
    x: 42,
    y: 42,
})
