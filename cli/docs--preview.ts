import Console from './utilities/Console'
import run from './utilities/run'

export default async function docsPreview(): Promise<void> {
    Console.log('👀 Starting VitePress preview server...')
    await run('pnpm vitepress preview docs')
}
