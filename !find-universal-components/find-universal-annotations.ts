import { readFileSync, readdirSync, statSync, writeFileSync } from 'fs'
import { join, basename, extname } from 'path'

interface UniversalAnnotation {
    file: string
    annotation: string
    componentName: string
    lineNumber: number
    type: 'react' | 'svelte' | 'vue' | 'solid'
}

interface UniversalAnnotationOutput {
    componentName: string
    filePath: string
    lineNumber: number
    type: string
    annotation: string
}

interface OutputData {
    totalFound: number
    annotations: UniversalAnnotationOutput[]
}

/**
 * Find all @universal-component annotations and extract component names
 */
function findUniversalAnnotations(dir: string): UniversalAnnotation[] {
    const results: UniversalAnnotation[] = []

    function scanDir(currentDir: string): void {
        try {
            const entries = readdirSync(currentDir)

            for (const entry of entries) {
                const fullPath = join(currentDir, entry)
                const stat = statSync(fullPath)

                if (stat.isDirectory()) {
                    // Skip common directories that don't contain components
                    if (
                        !['node_modules', '.git', '.svelte-kit', 'dist', 'build', '.dev'].includes(
                            entry
                        )
                    ) {
                        scanDir(fullPath)
                    }
                } else if (stat.isFile()) {
                    analyzeFile(fullPath)
                }
            }
        } catch {
            // Skip directories we can't read
        }
    }

    function analyzeFile(filePath: string): void {
        const ext = extname(filePath).toLowerCase()

        // Only check relevant file types
        if (!['.tsx', '.ts', '.jsx', '.js', '.svelte', '.vue'].includes(ext)) {
            return
        }

        try {
            const content = readFileSync(filePath, 'utf-8')

            // Look for @universal-component annotations
            if (content.includes('@universal-component')) {
                const lines = content.split('\n')

                for (let i = 0; i < lines.length; i++) {
                    const line = lines[i].trim()

                    // Check if this line contains the annotation
                    if (line.includes('@universal-component')) {
                        // Look for component name in subsequent lines
                        const componentName = findComponentName(lines, i, ext, filePath)

                        results.push({
                            file: filePath,
                            annotation: line,
                            componentName: componentName || 'Unknown',
                            lineNumber: i + 1,
                            type: getFileType(ext, content),
                        })
                    }
                }
            }
        } catch {
            // Skip files we can't read
        }
    }

    function findComponentName(
        lines: string[],
        annotationIndex: number,
        ext: string,
        filePath: string
    ): string | null {
        let componentName: string | null = null
        let interfaceName: string | null = null

        // Look in the next few lines after the annotation
        for (let i = annotationIndex + 1; i < Math.min(lines.length, annotationIndex + 15); i++) {
            const line = lines[i].trim()

            if (!line || line.startsWith('//') || line.startsWith('/*')) {
                continue
            }

            // Different patterns based on file type
            if (ext === '.svelte') {
                return basename(filePath, ext)
            }

            let match

            // Priority 1: Function component (most likely to be the component)
            match = line.match(/export\s+default\s+function\s+(\w+)/)
            if (match) return match[1]

            match = line.match(/(?:export\s+)?function\s+(\w+)/)
            if (match && !componentName) componentName = match[1]

            // Priority 2: Arrow function components
            match = line.match(/export\s+default\s+(\w+)/)
            if (match && !componentName) componentName = match[1]

            match = line.match(/(?:export\s+)?const\s+(\w+)\s*=.*=>/)
            if (match && !componentName) componentName = match[1]

            // Priority 3: Class component
            match = line.match(/(?:export\s+)?class\s+(\w+)/)
            if (match && !componentName) componentName = match[1]

            // Store interface name (lower priority)
            match = line.match(/interface\s+(\w+)Props/)
            if (match) interfaceName = match[1]

            match = line.match(/interface\s+(\w+)/)
            if (match && !interfaceName) interfaceName = match[1].replace(/Props$/, '')
        }

        // Return component name if found, otherwise interface name, otherwise filename
        if (componentName) return componentName
        if (interfaceName) return interfaceName

        // Fallback to filename
        return basename(filePath).replace(/\.(tsx?|jsx?|svelte|vue)$/, '')
    }

    function getFileType(ext: string, content: string): UniversalAnnotation['type'] {
        if (ext === '.svelte') return 'svelte'
        if (ext === '.vue') return 'vue'
        if (content.includes('solid-js')) return 'solid'
        return 'react'
    }

    scanDir(dir)
    return results
}

// Run the scanner
console.log('🔍 Scanning for @universal-component annotations...\n')

const annotations = findUniversalAnnotations('.')

if (annotations.length === 0) {
    console.log('❌ No @universal-component annotations found')
    process.exit(0)
}

console.log(`✅ Found ${annotations.length} @universal-component annotation(s):\n`)

// Group by type
const byType: Record<string, UniversalAnnotation[]> = {}
annotations.forEach(annotation => {
    if (!byType[annotation.type]) {
        byType[annotation.type] = []
    }
    byType[annotation.type].push(annotation)
})

// Display results
for (const [type, items] of Object.entries(byType)) {
    console.log(`📦 ${type.toUpperCase()} Components:`)

    items.forEach((item, index) => {
        console.log(`${index + 1}. ${item.componentName}`)
        console.log(`   📄 File: ${item.file}`)
        console.log(`   📍 Line: ${item.lineNumber}`)
        console.log(`   💬 Annotation: ${item.annotation}`)
        console.log()
    })
}

// Summary table
console.log('📊 Summary:')
console.log('┌─────────────────────────────────────────────────────────┬──────────────────┐')
console.log('│ Component Name                                          │ File Path        │')
console.log('├─────────────────────────────────────────────────────────┼──────────────────┤')

annotations.forEach(item => {
    const name = item.componentName.padEnd(55)
    const path = item.file.length > 16 ? '...' + item.file.slice(-13) : item.file.padEnd(16)
    console.log(`│ ${name} │ ${path} │`)
})

console.log('└─────────────────────────────────────────────────────────┴──────────────────┘')

// Export data as JSON for programmatic use
const outputData: OutputData = {
    totalFound: annotations.length,
    annotations: annotations.map(item => ({
        componentName: item.componentName,
        filePath: item.file,
        lineNumber: item.lineNumber,
        type: item.type,
        annotation: item.annotation,
    })),
}

// Optionally save to file
if (process.argv.includes('--save')) {
    const outputFile = 'universal-components.json'
    writeFileSync(outputFile, JSON.stringify(outputData, null, 2))
    console.log(`\n💾 Results saved to ${outputFile}`)
}

export { findUniversalAnnotations }
export type { UniversalAnnotation, UniversalAnnotationOutput, OutputData }
export default findUniversalAnnotations
