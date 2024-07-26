import './global'

class Foo extends Effect {
    @sync
    x: number

    onSyncContext() {
        console.log('ye, sync context')
    }
}

class App extends Sync {
    static list = [Foo]

    @sync
    title: string

    @sync
    foo: Foo
}

const app = new App()

const foo = new Foo(app)
app.foo = foo
foo.x = 42

//
class ClientApp extends ClientSync(App) {}

const clientApp = new ClientApp()
// eslint-disable-next-line no-console
console.log(clientApp.foo)
