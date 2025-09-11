import '#/imports'

@Singleton
export default class App {
    async create(): Promise<void> {
        await main()
    }
}

const testingThrowError = continuous(async () => {})
    .then(async () => {
        if (true) {
            throw Error('test')
        }
    })
    .catch(e => onAsyncError(e))

async function main(): Promise<void> {
    Console.success('Hello, world!')
}
