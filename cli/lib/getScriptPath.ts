import { fileURLToPath } from 'url'

export default function getScriptPath(importMetaUrl: string): string {
    const url = new URL('.', importMetaUrl)
    return fileURLToPath(url.toString())
}
