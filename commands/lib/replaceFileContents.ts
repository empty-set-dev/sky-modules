import fs from 'fs'

export default function replaceFileContents(file: string, contents: Record<string, string>): void {
    let content = fs.readFileSync(file, 'utf-8')
    Object.keys(contents).forEach(k => {
        content = content.replaceAll(k, contents[k])
    })
    fs.writeFileSync(file, content, 'utf-8')
}
