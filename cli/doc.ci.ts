import { generateDocsFromMarkdown, generateReadme } from './lib/index.ts'

export default async function doc(): Promise<void> {
    // Generate VitePress documentation
    await generateDocsFromMarkdown()

    // Generate unified README files
    await generateReadme()
}