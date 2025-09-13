import '#/server/imports'

@define('{{APP_ID}}.server.AppServer')
@Singleton
export default class App {
    async create(): Promise<void> {
        await main.call(this)
    }
}

async function main(this: App): Promise<void> {
    Console.success('Hello, world!')
}
