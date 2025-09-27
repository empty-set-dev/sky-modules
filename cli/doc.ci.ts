import generateDocsFromMarkdown from './lib/generateDocsFromMd'
import generateReadme from './lib/generateReadme'

export default async function doc(): Promise<void> {
    // Generate VitePress documentation
    await generateDocsFromMarkdown()

    // Generate unified README files
    await generateReadme()
}