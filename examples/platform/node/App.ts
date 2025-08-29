import './imports'

import Foo from './Foo'

@singleton
export default class App {
    @inject
    foo = getSingleton(Foo)

    async start(): Promise<void> {
        Console.log('App started')
        await idle((0.5).asSeconds)
        // Console.log('Hello, world!', this.foo)
        // Console.log('after')
    }
}
