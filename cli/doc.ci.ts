import generateDocsFromMarkdown from './lib/generateDocsFromMd.js'
import generateReadme from './lib/generateReadme.js'

export default async function doc(): Promise<void> {
    // Generate VitePress documentation
    await generateDocsFromMarkdown()

    // Generate unified README files
    await generateReadme()
}