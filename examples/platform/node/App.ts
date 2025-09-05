import '#/imports'

@singleton
export default class App {
    async create(): Promise<void> {
        await main()
    }
}

async function main(): Promise<void> {
    Console.log('Hello, world!')
}
