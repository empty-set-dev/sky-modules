import Console from './utilities/Console'
import generateDocsFromMarkdown from './utilities/generateDocsFromMd'
import generateReadme from './utilities/generateReadme'
import run from './utilities/run'

export default async function docsBuild(): Promise<void> {
    Console.log('📚 Generating documentation from markdown...')
    await generateDocsFromMarkdown()

    Console.log('🏗️ Building VitePress documentation...')
    await run('pnpm vitepress build docs')

    Console.log('📝 Generating unified README files...')
    await generateReadme()

    Console.log('✅ Documentation build complete!')
}
