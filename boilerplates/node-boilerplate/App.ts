import '#/imports'

@define('{{APP_ID}}.App')
@Singleton
export default class App {
    async create(): Promise<void> {
        Console.success('Hello, world!')
        await main()
    }
}

async function main(): Promise<void> {
    //
}
