import generateDocsFromMarkdown from '../cli/lib/generateDocsFromMd'
import generateReadme from '../cli/lib/generateReadme'

export default async function doc(): Promise<void> {
    // Generate VitePress documentation
    await generateDocsFromMarkdown()

    // Generate unified README files
    await generateReadme()
}