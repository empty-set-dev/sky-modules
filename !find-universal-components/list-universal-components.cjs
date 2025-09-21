/* eslint-disable no-console */
const fs = require('fs')
const path = require('path')

/**
 * Simple list of all @universal-component annotations
 */
function listUniversalComponents() {
    const results = []

    function scanDir(currentDir) {
        try {
            const entries = fs.readdirSync(currentDir)
            for (const entry of entries) {
                const fullPath = path.join(currentDir, entry)
                const stat = fs.statSync(fullPath)

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
        } catch (err) {
            // Skip
        }
    }

    function checkFile(filePath) {
        const ext = path.extname(filePath).toLowerCase()
        if (!['.tsx', '.ts', '.jsx', '.js', '.svelte', '.vue'].includes(ext)) return

        try {
            const content = fs.readFileSync(filePath, 'utf-8')
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
        } catch (err) {
            // Skip
        }
    }

    function extractComponentName(lines, annotationIndex, filePath) {
        // Look for component name after annotation
        for (let i = annotationIndex + 1; i < Math.min(lines.length, annotationIndex + 10); i++) {
            const line = lines[i].trim()
            if (!line || line.startsWith('//') || line.startsWith('/*')) continue

            // Function patterns
            let match =
                line.match(/export\s+default\s+function\s+(\w+)/) ||
                line.match(/function\s+(\w+)/) ||
                line.match(/const\s+(\w+)\s*=/) ||
                line.match(/class\s+(\w+)/)

            if (match) return match[1]
        }

        // Fallback to filename
        return path.basename(filePath).replace(/\.(tsx?|jsx?|svelte|vue)$/, '')
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
