import './global'

@effect
class Foo extends Effect {
    x: number

    onAppContext(app: App): () => void {
        console.log('app context')

        new Interval(
            () => {
                console.log('interval')
            },
            100,
            [this, app]
        )

        return (): void => {
            console.log('remove app context')
        }
    }
}

class App extends Root {
    static context = 'AppContext'

    title: string = 'Title'
    foo: Foo
}

// class AppSync extends Sync {
//     static list = [Foo]
// }

const app = new App()

// const appSync1 = new AppSync()
// const appSync2 = new AppSync()

// app.addContext(AppSync, appSync1)
// app.addContext(AppSync, appSync2)

const foo = new Foo(app)
//app.foo = foo
//foo.x = 42
setTimeout(() => {
    foo.removeParents(app)
}, 2000)

//
class ClientApp extends ClientSync(App) {}

const clientApp = new ClientApp()
// eslint-disable-next-line no-console
//console.log(clientApp.foo)
