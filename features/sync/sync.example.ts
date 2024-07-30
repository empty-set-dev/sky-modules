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

    @sync
    foo: Foo

    @sync
    title: string

    constructor(app: App) {
        super(updateData => {
            console.log(updateData)
        })

        this.foo = app.foo
        this.title = app.title

        new WithContext(app, this, this)
    }
}

const app = new App()

const foo = new Foo(app)
app.foo = foo
foo.x = 42

const clientAppSync1 = new AppSync(app)
const clientAppSync2 = new AppSync(app)

clientAppSync1.destroy()
clientAppSync2.destroy()

//
class ClientApp extends ClientSync(AppSync) {}

// const clientApp1 = new ClientApp()
// const clientApp2 = new ClientApp()
//eslint-disable-next-line no-console
// console.log(clientAppSync1.foo)
