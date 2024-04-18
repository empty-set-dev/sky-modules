import fs from 'fs'

export default function __getEntry(name: string, extensions: string[]): undefined | string {
    const paths: string[] = []
    if (extensions.some(ext => name.endsWith(`.${ext}`))) {
        paths.push(name)
    }

    for (const ext of extensions) {
        paths.push(`${name}.${ext}`)
        paths.push(`${name}/index.${ext}`)
    }

    for (const path of paths) {
        if (exists(path)) {
            return path
        }
    }

    throw new Error(`no entry:\n  ${paths.join('\n  ')}`)
}

function exists(filePath: string): boolean {
    return fs.existsSync(filePath)
}
