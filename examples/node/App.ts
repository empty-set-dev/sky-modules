import '#/imports'
import Console from '@sky-modules/core/Console'

@injectable()
export default class App {
    async create(): Promise<void> {
        await main()
    }
}

async function main(): Promise<void> {
    Console.success('Hello, world!')
}
