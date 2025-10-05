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
            // Process new structure (direct files, assume React for now)
            Console.log('📁 Processing direct structure as React hooks...')
            this.processTargetDirectory(targetPath, 'react')
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
        // Check if it's a TypeScript file starting with 'use'
        if (!fileName.match(/^use\w+\.(ts|tsx|js|jsx)$/)) {
            return false
        }

        try {
            const content = fs.readFileSync(filePath, 'utf8')
            // Check if it contains Mitosis hook patterns (useState, useRef, onUpdate)
            // and is a function export (can be default or named)
            return (
                /useState|useRef|onUpdate/.test(content) &&
                (/export\s+default\s+function\s+use\w+/.test(content) ||
                    /export\s+function\s+use\w+/.test(content) ||
                    /function\s+use\w+/.test(content))
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
            default:
                Console.log(
                    `⚠️ Unsupported target: ${target}, using React transform for ${filePath}`
                )
                return this.transformReactHooks(code)
        }
    }

    private transformReactHooks(code: string): string {
        let transformedCode = code

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
}

export default HookPostProcessor
