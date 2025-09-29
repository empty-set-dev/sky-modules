import generateDocsFromMarkdown from './utilities/generateDocsFromMd'
import generateReadme from './utilities/generateReadme'
import run from './utilities/run'

export default async function doc(): Promise<void> {
    // Generate VitePress documentation
    await generateDocsFromMarkdown()
    await run('pnpm vitepress build docs')

    // Generate unified README files
    await generateReadme()
}
