import './imports'

@define('app.App')
@singleton
export default class App {
    async create(): Promise<void> {
        Console.log('Hello, world!')
    }
}
