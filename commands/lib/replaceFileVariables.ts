import fs from 'fs'

export default function replaceFileVariables(
    file: string,
    variables: Record<string, string>
): void {
    let content = fs.readFileSync(file, 'utf-8')
    Object.keys(variables).forEach(k => {
        content = content.replaceAll(`\${${k}}`, variables[k])
    })
    fs.writeFileSync(file, content, 'utf-8')
}
