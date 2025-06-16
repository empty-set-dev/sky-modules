import { fileURLToPath } from 'url'

export default function getScriptPath(importMetaUrl: string): string {
    return fileURLToPath(new URL('.', importMetaUrl))
}
