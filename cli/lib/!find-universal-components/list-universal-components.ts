import { readFileSync, readdirSync, statSync } from 'fs'
import { join, basename, extname } from 'path'

interface UniversalComponent {
    name: string
    path: string
    line: number
}

/**
 * Simple list of all @universal-component annotations
 */
function listUniversalComponents(): UniversalComponent[] {
    const results: UniversalComponent[] = []

    function scanDir(currentDir: string): void {
        try {
            const entries = readdirSync(currentDir)
            for (const entry of entries) {
                const fullPath = join(currentDir, entry)
                const stat = statSync(fullPath)

                if (stat.isDirectory()) {
                    if (
                        !['node_modules', '.git', '.svelte-kit', 'dist', 'build', '.dev'].includes(
                            entry
                        )
                    ) {
                        scanDir(fullPath)
                    }
                } else if (stat.isFile()) {
                    checkFile(fullPath)
                }
            }
        } catch {
            // Skip directories we can't read
        }
    }

    function checkFile(filePath: string): void {
        const ext = extname(filePath).toLowerCase()
        if (!['.tsx', '.ts', '.jsx', '.js', '.svelte', '.vue'].includes(ext)) return

        try {
            const content = readFileSync(filePath, 'utf-8')
            if (content.includes('@universal-component')) {
                const lines = content.split('\n')
                for (let i = 0; i < lines.length; i++) {
                    if (lines[i].includes('@universal-component')) {
                        const componentName = extractComponentName(lines, i, filePath)
                        results.push({ name: componentName, path: filePath, line: i + 1 })
                        break
                    }
                }
            }
        } catch {
            // Skip files we can't read
        }
    }

    function extractComponentName(lines: string[], annotationIndex: number, filePath: string): string {
        // Look for component name after annotation
        for (let i = annotationIndex + 1; i < Math.min(lines.length, annotationIndex + 10); i++) {
            const line = lines[i].trim()
            if (!line || line.startsWith('//') || line.startsWith('/*')) continue

            // Function patterns
            const match =
                line.match(/export\s+default\s+function\s+(\w+)/) ||
                line.match(/function\s+(\w+)/) ||
                line.match(/const\s+(\w+)\s*=/) ||
                line.match(/class\s+(\w+)/)

            if (match) return match[1]
        }

        // Fallback to filename
        return basename(filePath).replace(/\.(tsx?|jsx?|svelte|vue)$/, '')
    }

    scanDir('.')
    return results
}

// Run and output simple list
const components = listUniversalComponents()

if (components.length === 0) {
    console.log('No @universal-component annotations found')
} else {
    console.log(`Found ${components.length} universal components:\n`)
    components.forEach(comp => {
        console.log(`${comp.name} - ${comp.path}:${comp.line}`)
    })
}

export { listUniversalComponents }
export type { UniversalComponent }
export default listUniversalComponents