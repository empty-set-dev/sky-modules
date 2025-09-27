import generateDocsFromMarkdown from './lib/generateDocsFromMd.ts'
import generateReadme from './lib/generateReadme.ts'

export default async function doc(): Promise<void> {
    // Generate VitePress documentation
    await generateDocsFromMarkdown()

    // Generate unified README files
    await generateReadme()
}