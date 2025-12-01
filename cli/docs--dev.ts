import Console from './utilities/Console'
import generateDocsFromMarkdown from './utilities/generateDocsFromMd'
import run from './utilities/run'

export default async function docsDev(): Promise<void> {
    Console.log('📚 Generating documentation from markdown...')
    await generateDocsFromMarkdown()

    Console.log('🚀 Starting VitePress development server...')
    await run('pnpm vitepress dev docs')
}
