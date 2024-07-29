import './global'

@effect
class Foo extends Effect {
    x: number
}

class App extends Root {
    static context = 'AppContext'

    title: string = 'Title'
    foo: Foo
}

class AppSync extends Sync {
    static list = [Foo]
}

const app = new App()

const appSync1 = new AppSync()
const appSync2 = new AppSync()

app.addContext(AppSync, appSync1)
app.addContext(AppSync, appSync2)

const foo = new Foo(app)
app.foo = foo
foo.x = 42

//
class ClientApp extends ClientSync(App) {}

const clientApp = new ClientApp()
//eslint-disable-next-line no-console
console.log(clientApp.foo)
