import '#/imports'

@singleton
export default class App {
    async create(): Promise<void> {
        await main()
    }
}

async function main(): Promise<void> {
    Console.success('Hello, world!', 42, { x: 42, y: 'Hello, world!' })
    Console.info('Hello, world!', 42, { x: 42, y: 'Hello, world!' })
    Console.log('Hello, world!', 42, { x: 42, y: 'Hello, world!' })
    Console.debug('Hello, world!', 42, { x: 42, y: 'Hello, world!' })
    Console.warn('Hello, world!', 42, { x: 42, y: 'Hello, world!' })
    Console.error('Hello, world!', 42, { x: 42, y: 'Hello, world!' })
}
