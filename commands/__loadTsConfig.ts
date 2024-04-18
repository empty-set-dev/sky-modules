import fs from 'fs'
import path from 'path'

export default interface __loadTsConfig {
    warning?: boolean
}
export default function __loadTsConfig(
    configPath: string,
    options?: __loadTsConfig
): {
    include: string[]
    compilerOptions: { paths: Record<string, string[]> }
} {
    options ??= {}

    const exists = fs.existsSync('tsconfig.json')
    const nameExists = fs.existsSync(path.join(configPath ?? '', 'tsconfig.json'))
    if (!exists && !nameExists) {
        if (options.warning !== false) {
            // eslint-disable-next-line no-console
            console.error('missing "tsconfig.json"')
        }
        return
    }

    return JSON.parse(
        fs.readFileSync(
            nameExists ? path.resolve(configPath ?? '', 'tsconfig.json') : 'tsconfig.json',
            'utf-8'
        )
    )
}
