import { fileURLToPath } from 'url'

export default function getScriptPath(importMetaUrl: string): string {
    let scriptPath = fileURLToPath(new URL('.', importMetaUrl))

    if (scriptPath === '') {
        scriptPath = '.'
    }

    return scriptPath
}
