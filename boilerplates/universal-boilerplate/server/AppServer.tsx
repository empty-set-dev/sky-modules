import '#/server/imports'

@define('${APP_ID}.server.AppServer')
@singleton
export default class App {
    async create(): Promise<void> {
        await main.call(this)
    }
}

async function main(this: App): Promise<void> {
    Console.log('Hello, world!')
}
