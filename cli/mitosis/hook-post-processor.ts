import fs from 'fs'
import path from 'path'

import Console from '../utilities/Console'

export interface HookPostProcessorOptions {
    enabled?: boolean
}

/**
 * Post-processes Mitosis hooks after generation to transform them for each framework
 */
export class HookPostProcessor {
    private enabled: boolean

    constructor(options: HookPostProcessorOptions = {}) {
        this.enabled = options.enabled ?? true
    }

    /**
     * Process all hook files in target directory
     */
    processHooks(targetPath: string): void {
        if (!this.enabled) return

        Console.log('🔄 Post-processing hooks for framework compatibility...')

        const targets = ['react', 'vue', 'svelte', 'angular', 'qwik', 'solid']

        // Check for old structure (with framework subdirectories)
        const hasFrameworkDirs = targets.some(target =>
            fs.existsSync(path.join(targetPath, target))
        )

        if (hasFrameworkDirs) {
            // Process old structure
            targets.forEach(target => {
                const targetDir = path.join(targetPath, target)

                if (fs.existsSync(targetDir)) {
                    this.processTargetDirectory(targetDir, target)
                }
            })
        } else {
            // Process new structure (direct files, assume Solid for Sky JSX)
            Console.log('📁 Processing direct structure as Solid hooks...')
            this.processTargetDirectory(targetPath, 'solid')
        }
    }

    private processTargetDirectory(targetDir: string, target: string): void {
        const hookFiles = this.findHookFiles(targetDir)

        hookFiles.forEach(filePath => {
            try {
                const content = fs.readFileSync(filePath, 'utf8')
                const transformedContent = this.transformHookForTarget(content, target, filePath)

                if (transformedContent !== content) {
                    fs.writeFileSync(filePath, transformedContent, 'utf8')
                    Console.log(
                        `✅ Transformed hook: ${path.relative(targetDir, filePath)} for ${target}`
                    )
                }
            } catch (error) {
                Console.error(`❌ Failed to process hook ${filePath}: ${error}`)
            }
        })
    }

    private findHookFiles(dir: string): string[] {
        const hookFiles: string[] = []

        const searchDirectory = (currentDir: string): void => {
            try {
                const items = fs.readdirSync(currentDir, { withFileTypes: true })

                for (const item of items) {
                    const fullPath = path.join(currentDir, item.name)

                    if (item.isDirectory()) {
                        searchDirectory(fullPath)
                    } else if (item.isFile() && this.isHookFile(item.name, fullPath)) {
                        hookFiles.push(fullPath)
                    }
                }
            } catch (error) {
                Console.error(`❌ Failed to read directory ${currentDir}: ${error}`)
            }
        }

        searchDirectory(dir)
        return hookFiles
    }

    private isHookFile(fileName: string, filePath: string): boolean {
        // Check if it's a TypeScript file
        if (!fileName.match(/\.(ts|tsx|js|jsx)$/)) {
            return false
        }

        try {
            const content = fs.readFileSync(filePath, 'utf8')
            // Check if it contains Mitosis patterns (hooks or components with onUnMount)
            return (
                /useState|useRef|onUpdate|useStore|onMount|onUnMount|setContext/.test(content) &&
                (/export\s+default\s+function\s+use\w+/.test(content) || /onUnMount/.test(content))
            )
        } catch {
            return false
        }
    }

    private transformHookForTarget(code: string, target: string, filePath: string): string {
        switch (target) {
            case 'react':
                return this.transformReactHooks(code)
            case 'vue':
                return this.transformVueHooks(code)
            case 'svelte':
                return this.transformSvelteHooks(code)
            case 'solid':
                return this.transformSolidHooks(code)
            default:
                Console.log(
                    `⚠️ Unsupported target: ${target}, using React transform for ${filePath}`
                )
                return this.transformReactHooks(code)
        }
    }

    private transformReactHooks(code: string): string {
        let transformedCode = code

        // Remove Mitosis imports
        transformedCode = transformedCode.replace(
            /import\s*\{[^}]*\}\s*from\s*['"]@builder\.io\/mitosis['"];?\s*/g,
            ''
        )

        // Add React imports at the top if not present
        if (!transformedCode.includes('import { useState, useRef, useEffect }')) {
            // Find first import and insert React imports after it
            const firstImportMatch = transformedCode.match(/^import\s+.*$/m)

            if (firstImportMatch) {
                const insertPos =
                    transformedCode.indexOf(firstImportMatch[0]) + firstImportMatch[0].length
                transformedCode =
                    transformedCode.slice(0, insertPos) +
                    "\nimport { useState, useRef, useEffect } from 'react';" +
                    transformedCode.slice(insertPos)
            } else {
                transformedCode =
                    "import { useState, useRef, useEffect } from 'react';\n" + transformedCode
            }
        }

        // Transform onUpdate to useEffect (with dependencies) - multiline support
        transformedCode = transformedCode.replace(
            /onUpdate\s*\(\s*\(\s*\)\s*=>\s*\{([\s\S]*?)\},\s*(\[[^\]]*\])\s*\)/g,
            'useEffect(() => {$1}, $2)'
        )

        // Transform onUpdate to useEffect (without dependencies) - multiline support
        transformedCode = transformedCode.replace(
            /onUpdate\s*\(\s*\(\s*\)\s*=>\s*\{([\s\S]*?)\}\s*\)/g,
            'useEffect(() => {$1}, [])'
        )

        // Transform onMount to useEffect
        transformedCode = transformedCode.replace(
            /onMount\s*\(\s*\(\s*\)\s*=>\s*\{([\s\S]*?)\}\s*\)/g,
            'useEffect(() => {$1}, [])'
        )

        // Transform onUnMount to useEffect with cleanup
        transformedCode = transformedCode.replace(
            /onUnMount\s*\(\s*\(\s*\)\s*=>\s*\{([\s\S]*?)\}\s*\)/g,
            'useEffect(() => { return () => {$1}; }, [])'
        )

        // Transform useStore to useState (simplified)
        transformedCode = transformedCode.replace(
            /const\s+(\w+)\s*=\s*useStore\s*\(\s*\{([\s\S]*?)\}\s*\)/g,
            (match, stateName, stateContent) => {
                // Extract state properties and convert to useState calls
                const stateLines = stateContent
                    .split(',')
                    .map((line: string) => {
                        const trimmed = line.trim()

                        if (trimmed.includes(':') && !trimmed.includes('(')) {
                            const [key, value] = trimmed.split(':').map(s => s.trim())
                            return `const [${key}, set${key.charAt(0).toUpperCase() + key.slice(1)}] = useState(${value});`
                        }

                        return ''
                    })
                    .filter(Boolean)

                return stateLines.join('\n  ')
            }
        )

        // Remove setContext calls (not directly translatable to React)
        transformedCode = transformedCode.replace(
            /setContext\s*\([^)]*\)\s*;?\s*/g,
            '// setContext removed - use React Context manually'
        )

        // Find all ref variables declared with useRef
        const refVariables = new Set<string>()
        const refDeclarationMatches =
            transformedCode.match(/(const|let|var)\s+(\w+)\s*=\s*useRef/g) || []
        refDeclarationMatches.forEach(match => {
            const refName = match.match(/(const|let|var)\s+(\w+)\s*=/)?.[2]

            if (refName) refVariables.add(refName)
        })

        // Universal ref processing - add .current where needed
        if (refVariables.size > 0) {
            transformedCode = this.addCurrentToRefs(transformedCode, refVariables)
        }

        return transformedCode
    }

    /**
     * Universal method to add .current to ref variables where needed
     */
    private addCurrentToRefs(code: string, refVariables: Set<string>): string {
        let result = code

        // Process each ref variable
        refVariables.forEach(refName => {
            // Comprehensive ref replacement - replace all instances except in declarations and return
            // Find all uses of the ref variable that need .current

            // Create regex to match the ref variable, but not when:
            // 1. It's a declaration (const refName = useRef)
            // 2. It already has .current
            // 3. It's in a return object (for refs that should be returned as-is)
            const refPattern = new RegExp(`\\b(${refName})(?!\\.current)(?!\\s*=\\s*useRef)`, 'g')

            result = result.replace(refPattern, (match, varName, offset) => {
                const beforeMatch = result.substring(Math.max(0, offset - 30), offset)

                // Skip if this is a declaration
                if (/(?:const|let|var)\s+$/.test(beforeMatch)) {
                    return match
                }

                // Skip if it's in a return statement (refs should be returned as-is)
                if (/return\s*\{[^}]*$/.test(beforeMatch)) {
                    return match
                }

                // Add .current for all other uses
                return `${varName}.current`
            })
        })

        // Clean up any double .current.current
        result = result.replace(/(\w+)\.current\.current/g, '$1.current')

        // Final cleanup: Remove .current from return objects for ref variables
        result = result.replace(/return\s*\{([^}]*)\}/, (match, content) => {
            let fixedContent = content
            refVariables.forEach(refName => {
                // Remove .current from ref variables in return objects
                fixedContent = fixedContent.replace(
                    new RegExp(`(\\b${refName})\\.current(?=\\s*[,}\\n])`, 'g'),
                    '$1'
                )
            })
            return `return {${fixedContent}}`
        })

        return result
    }

    private transformVueHooks(code: string): string {
        let transformedCode = code

        // Add Vue imports
        if (!transformedCode.includes('import') || !transformedCode.includes('vue')) {
            const vueImports = `import { ref, watch } from 'vue';\n`
            transformedCode = vueImports + transformedCode
        }

        // Transform useState to ref
        transformedCode = transformedCode.replace(
            /const\s+\[(\w+),\s*set(\w+)\]\s*=\s*useState\(([^)]*)\)/g,
            'const $1 = ref($3)'
        )

        // Transform useRef to ref
        transformedCode = transformedCode.replace(
            /const\s+(\w+)\s*=\s*useRef\(([^)]*)\)/g,
            'const $1 = ref($2)'
        )

        // Remove .current from refs in Vue (Vue refs are reactive)
        transformedCode = transformedCode.replace(/(\w+Ref)\.current/g, '$1.value')

        // Transform onUpdate to watch
        transformedCode = transformedCode.replace(
            /onUpdate\s*\(\s*\(\s*\)\s*=>\s*\{([^}]*(?:\{[^}]*\}[^}]*)*)\},\s*(\[([^\]]*)\])\s*\)/g,
            'watch([$3], () => {$1})'
        )

        return transformedCode
    }

    private transformSvelteHooks(code: string): string {
        let transformedCode = code

        // Add Svelte imports
        if (!transformedCode.includes('import') || !transformedCode.includes('svelte')) {
            const svelteImports = `import { writable } from 'svelte/store';\n`
            transformedCode = svelteImports + transformedCode
        }

        // Transform useState to writable store
        transformedCode = transformedCode.replace(
            /const\s+\[(\w+),\s*set(\w+)\]\s*=\s*useState\(([^)]*)\)/g,
            'const $1 = writable($3)'
        )

        // Transform useRef to writable store
        transformedCode = transformedCode.replace(
            /const\s+(\w+)\s*=\s*useRef\(([^)]*)\)/g,
            'const $1 = writable($2)'
        )

        // Transform onUpdate to reactive statement
        transformedCode = transformedCode.replace(
            /onUpdate\s*\(\s*\(\s*\)\s*=>\s*\{([^}]*(?:\{[^}]*\}[^}]*)*)\},\s*(\[([^\]]*)\])\s*\)/g,
            '$: { if ($3) { $1 } }'
        )

        return transformedCode
    }

    private transformSolidHooks(code: string): string {
        let transformedCode = code

        // Remove Mitosis imports
        transformedCode = transformedCode.replace(
            /import\s*\{[^}]*\}\s*from\s*['"]@builder\.io\/mitosis['"];?\s*/g,
            ''
        )

        // Track what we'll need for imports (check before transformations)
        const initialHasOnMount = /\bonMount\s*\(/.test(transformedCode)
        const initialHasOnUnMount = /\bonUnMount\s*\(/.test(transformedCode)
        const initialHasCreateSignal = /\bcreateSignal\s*\(/.test(transformedCode)

        // Track signal variables
        const signalGetters = new Set<string>()

        // Transform useState to createSignal (handle generic types)
        transformedCode = transformedCode.replace(
            /const\s+\[(\w+),\s*set(\w+)\]\s*=\s*useState\s*(?:<[^>]+>)?\s*\(([^)]*)\)/g,
            (match, getter, setter, initial) => {
                // Track this as a signal getter
                signalGetters.add(getter)
                // Capitalize first letter of getter for setter name
                const setterName = 'set' + getter.charAt(0).toUpperCase() + getter.slice(1)
                return `const [${getter}, ${setterName}] = createSignal(${initial})`
            }
        )

        // Add () calls to signal getters (but not in declarations or setter calls)
        signalGetters.forEach(getter => {
            // Match getter usage but not in:
            // - const [getter, ...] declarations
            // - setter calls like setGetter(...)
            // - already called like getter()
            // - part of another identifier like updateComponent (negative lookahead for word chars)
            const pattern = new RegExp(`\\b(${getter})(?![\\w\\(\\:,\\]])`, 'g')
            transformedCode = transformedCode.replace(pattern, (match, name, offset) => {
                const before = transformedCode.substring(Math.max(0, offset - 50), offset)
                const after = transformedCode.substring(
                    offset + match.length,
                    offset + match.length + 2
                )

                // Skip if in declaration
                if (/const\s+\[\w*$/.test(before)) return match

                // Skip if in return statement array [getter, setter]
                if (/return\s+\[[\w\s,]*$/.test(before) && /\s*,/.test(after)) return match

                // Add () call
                return `${name}()`
            })
        })

        // Fix return type signature to use getters
        transformedCode = transformedCode.replace(
            /\]\s*:\s*\[([^,]+),\s*\((\w+):\s*([^)]+)\)\s*=>\s*void\]/,
            (match, type1, paramName, paramType) => {
                // Change from [T | null, (controller: T) => void]
                // to [() => T | null, (controller: T) => void]
                return `]: [() => ${type1}, (${paramName}: ${paramType}) => void]`
            }
        )

        // Transform nested onUnMount inside onMount to just onCleanup
        transformedCode = transformedCode.replace(
            /onMount\s*\(\s*\(\s*\)\s*=>\s*\{([\s\S]*?)onUnMount\s*\(\s*\(\s*\)\s*=>\s*\{([\s\S]*?)\}\s*\)([\s\S]*?)\}\s*\)/g,
            (match, before, cleanupCode, after) => {
                return `onMount(() => {${before}onCleanup(() => {${cleanupCode}});${after}})`
            }
        )

        // Transform standalone onUnMount to createEffect with onCleanup
        transformedCode = transformedCode.replace(
            /onUnMount\s*\(\s*\(\s*\)\s*=>\s*\{([\s\S]*?)\}\s*\)/g,
            'createEffect(() => { onCleanup(() => {$1}); })'
        )

        // Note: We keep onMount as is - Solid.js has onMount natively

        // Declare variables used but not declared
        const undeclaredVars = new Set<string>()

        // Find all simple assignments in the code (varName = value)
        // Match: varName = new/requestAnimationFrame/number/null/false/true/identifier
        const allAssignments =
            transformedCode.match(
                /\b(\w+)\s*=\s*(?:new\s+\w+|requestAnimationFrame\(|[-+]?\d+|null|false|true|\w+)/g
            ) || []

        allAssignments.forEach(assignment => {
            const varName = assignment.match(/^(\w+)\s*=/)?.[1]

            // Skip if already declared
            if (
                !varName ||
                transformedCode.includes(`let ${varName}`) ||
                transformedCode.includes(`const ${varName}`)
            ) {
                return
            }

            // Skip common keywords and props
            if (
                ['props', 'this', 'window', 'document', 'canvas', 'width', 'height'].includes(
                    varName
                )
            ) {
                return
            }

            // Check if it's used with ++ or -- (likely a counter)
            const hasIncrement = new RegExp(`\\b${varName}\\s*(?:\\+\\+|\\-\\-)`).test(
                transformedCode
            )

            // Check if used in mathematical operations
            const hasArithmetic =
                new RegExp(`\\b${varName}\\s*[-+*/]`).test(transformedCode) ||
                new RegExp(`[-+*/]\\s*${varName}\\b`).test(transformedCode)

            // Check type based on assignment
            if (assignment.includes('requestAnimationFrame')) {
                undeclaredVars.add(`let ${varName}: number | null = null;`)
            } else if (assignment.includes('new')) {
                // Try to extract type from 'new ClassName'
                const className = assignment.match(/new\s+(\w+)/)?.[1]

                if (className) {
                    undeclaredVars.add(`let ${varName}: ${className} | null = null;`)
                }
            } else if (/=\s*[-+]?\d+/.test(assignment) || hasIncrement || hasArithmetic) {
                // Numeric assignment, used with ++ / --, or in arithmetic operations
                undeclaredVars.add(`let ${varName} = 0;`)
            }
        })

        if (undeclaredVars.size > 0) {
            // Find where to insert - after existing let declarations or after imports
            const lastLetMatch = transformedCode.match(/let\s+\w+[^;]*;[^\n]*/g)?.slice(-1)[0]

            if (lastLetMatch) {
                const insertPos = transformedCode.indexOf(lastLetMatch) + lastLetMatch.length
                transformedCode =
                    transformedCode.slice(0, insertPos) +
                    '\n' +
                    Array.from(undeclaredVars).join('\n') +
                    transformedCode.slice(insertPos)
            }
        }

        // Transform onUpdate to createEffect with dependencies
        transformedCode = transformedCode.replace(
            /onUpdate\s*\(\s*\(\s*\)\s*=>\s*\{([\s\S]*?)\},\s*(\[[^\]]*\])\s*\)/g,
            'createEffect(() => {$1})'
        )

        // Add imports at the end (after all transformations)
        const needsImports = !transformedCode.includes("from 'solid-js'")
        const finalHasOnMount = /\bonMount\s*\(/.test(transformedCode)
        const finalHasOnCleanup = /\bonCleanup\s*\(/.test(transformedCode)
        const finalHasCreateEffect = /\bcreateEffect\s*\(/.test(transformedCode)
        const finalHasCreateSignal = /\bcreateSignal\s*\(/.test(transformedCode)

        if (needsImports) {
            const imports = []
            if (finalHasCreateSignal || initialHasCreateSignal) imports.push('createSignal')
            if (finalHasCreateEffect) imports.push('createEffect')
            if (finalHasOnMount || initialHasOnMount) imports.push('onMount')
            if (finalHasOnCleanup || initialHasOnUnMount) imports.push('onCleanup')

            if (imports.length > 0) {
                transformedCode =
                    `import { ${imports.join(', ')} } from 'solid-js';\n` + transformedCode
            }
        } else if (finalHasOnCleanup && transformedCode.includes("from 'solid-js'")) {
            // Add onCleanup to existing solid-js imports if needed
            transformedCode = transformedCode.replace(
                /(import\s*\{)([^}]*?)(\}\s*from\s*'solid-js')/,
                (match, start, imports, end) => {
                    if (!imports.includes('onCleanup')) {
                        return `${start}${imports}, onCleanup${end}`
                    }

                    return match
                }
            )
        }

        return transformedCode
    }
}

export default HookPostProcessor
