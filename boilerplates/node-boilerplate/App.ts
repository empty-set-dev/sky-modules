import '#/imports'

@define('${APP_ID}.App')
@singleton
export default class App {
    async create(): Promise<void> {
        Console.log('Hello, world!')
    }
}
