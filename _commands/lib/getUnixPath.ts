export default function getUnixPath(path: string): string {
    return path.replace(/^(.?):[/\\][/\\]/g, 'file:///$1:\\').replaceAll('\\', '/')
}
