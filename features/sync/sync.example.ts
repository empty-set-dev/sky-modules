import './global'

@sync
@effect
class Foo extends Effect {
    @sync
    x: number
}

class App extends Root {
    static context = 'AppContext'

    title: string = 'Title'
    foo: Foo
}

class AppSync extends Sync {
    static list = [Foo]

    constructor() {
        super(updateData => {
            console.log(updateData)
        })
    }
}

const app = new App()

const appSync1 = new AppSync()
const appSync2 = new AppSync()

app.addContext(appSync1)
app.addContext(appSync2)

const foo = new Foo(app)
app.foo = foo
foo.x = 42

app.removeContext(appSync1)
app.removeContext(appSync2)

//
class ClientApp extends ClientSync(App) {}

const clientApp1 = new ClientApp()
const clientApp2 = new ClientApp()
//eslint-disable-next-line no-console
// console.log(clientApp1.foo)
