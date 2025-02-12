import '#/imports'

function action_hook(arg1: unknown, arg2: unknown) {}

interface MouseDownEvent {
    x: number
    y: number
}

class App extends EffectsRoot {}

class Foo extends Effect {
    @action_hook
    mouseDown(e: MouseDownEvent) {
        console.log(e)
    }
}

const app = new App()

const foo = new Foo(app)

app.emit('mouseDown', {
    x: 42,
    y: 42,
})
