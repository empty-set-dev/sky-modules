import fs from 'fs'
import path from 'path'

export default function loadTsConfig(name: string): {
    include: string[]
    compilerOptions: { paths: Record<string, string[]> }
} {
    const exists = fs.existsSync('tsconfig.json')
    const nameExists = fs.existsSync(path.resolve(name ?? '', 'tsconfig.json'))
    if (!exists && !nameExists) {
        // eslint-disable-next-line no-console
        console.error('missing "tsconfig.json"')
        return
    }

    return JSON.parse(
        fs.readFileSync(
            nameExists ? path.resolve(name ?? '', 'tsconfig.json') : 'tsconfig.json',
            'utf-8'
        )
    )
}
