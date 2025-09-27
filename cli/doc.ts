import generateDocsFromMarkdown from './lib/generateDocsFromMd'

export default async function doc(): Promise<void> {
    return generateDocsFromMarkdown()
}