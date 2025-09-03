import './imports'

@define('${APP_ID}.App')
@singleton
export default class App {
    async start(): Promise<void> {
        Console.log('Hello, world!')
    }
}
