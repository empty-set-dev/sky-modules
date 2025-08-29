import App from './App'

@singleton
export default class Foo {
    @weak_inject
    app = getSingleton(App)
    // @inject
    // foo = getSingleton(Foo)

    async start(): Promise<void> {
        Console.log('Foo started')
        await idle((0.5).asSeconds)
        Console.log('Foo')
    }
}
