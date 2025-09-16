/* eslint-disable no-console */
import * as fs from 'fs'
import * as path from 'path'

interface ComponentInfo {
    filePath: string
    componentName: string
    line: number
}

function findUniversalComponents(directory: string): ComponentInfo[] {
    const results: ComponentInfo[] = []

    function processDirectory(dir: string): void {
        const entries = fs.readdirSync(dir, { withFileTypes: true })

        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name)

            if (entry.isDirectory()) {
                processDirectory(fullPath)
            } else if (
                entry.isFile() &&
                (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx'))
            ) {
                processFile(fullPath)
            }
        }
    }

    function processFile(filePath: string): void {
        try {
            const content = fs.readFileSync(filePath, 'utf-8')
            const lines = content.split('\n')

            for (let i = 0; i < lines.length; i++) {
                const line = lines[i]

                if (line.includes('// @universal-comment')) {
                    const componentName = extractComponentName(lines, i)
                    if (componentName) {
                        results.push({
                            filePath: path.relative(directory, filePath),
                            componentName,
                            line: i + 1,
                        })
                    }
                }
            }
        } catch (error) {
            console.error(`Error reading file ${filePath}:`, error)
        }
    }

    function extractComponentName(lines: string[], commentIndex: number): string | null {
        // Look for component definition after the comment
        for (let i = commentIndex + 1; i < Math.min(commentIndex + 10, lines.length); i++) {
            const line = lines[i].trim()

            // React component patterns
            const reactComponentMatch = line.match(
                /^export\s+(?:default\s+)?(?:const|function)\s+([A-Z]\w*)/
            )
            if (reactComponentMatch) {
                return reactComponentMatch[1]
            }

            // Class component
            const classComponentMatch = line.match(/^export\s+(?:default\s+)?class\s+([A-Z]\w*)/)
            if (classComponentMatch) {
                return classComponentMatch[1]
            }

            // Arrow function component
            const arrowComponentMatch = line.match(
                /^(?:export\s+)?(?:const|let)\s+([A-Z]\w*)\s*[:=]/
            )
            if (arrowComponentMatch) {
                return arrowComponentMatch[1]
            }

            // Interface or type
            const typeMatch = line.match(/^export\s+(?:interface|type)\s+([A-Z]\w*)/)
            if (typeMatch) {
                return typeMatch[1]
            }
        }

        // Look before the comment as well
        for (let i = Math.max(0, commentIndex - 3); i < commentIndex; i++) {
            const line = lines[i].trim()

            const reactComponentMatch = line.match(
                /^export\s+(?:default\s+)?(?:const|function)\s+([A-Z]\w*)/
            )
            if (reactComponentMatch) {
                return reactComponentMatch[1]
            }
        }

        return null
    }

    processDirectory(directory)
    return results
}

function main(): void {
    const directory = process.argv[2] || '.'

    if (!fs.existsSync(directory)) {
        console.error(`Directory ${directory} does not exist`)
        process.exit(1)
    }

    console.log(`Searching for components with @universal-comment in: ${directory}\n`)

    const components = findUniversalComponents(directory)

    if (components.length === 0) {
        console.log('No components with @universal-comment found.')
    } else {
        console.log(`Found ${components.length} component(s):\n`)

        components.forEach((comp, index) => {
            console.log(`${index + 1}. ${comp.componentName}`)
            console.log(`   File: ${comp.filePath}`)
            console.log(`   Line: ${comp.line}\n`)
        })

        // Output as JSON for programmatic use
        console.log('\nJSON output:')
        console.log(JSON.stringify(components, null, 2))
    }
}

if (require.main === module) {
    main()
}

export { findUniversalComponents, ComponentInfo }
