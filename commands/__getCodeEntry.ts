import __getEntry from './__getEntry'

export default function __getCodeEntry(entryPath: string): ReturnType<typeof __getEntry> {
    return __getEntry(entryPath, ['tsx', 'ts', 'mts', 'jsx', 'js', 'mjs'])
}
