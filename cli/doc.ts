import generateDocsFromMarkdown from './utilities/generateDocsFromMd'
import generateReadme from './utilities/generateReadme'

export default async function doc(): Promise<void> {
    // Generate VitePress documentation
    await generateDocsFromMarkdown()

    // Generate unified README files
    await generateReadme()
}