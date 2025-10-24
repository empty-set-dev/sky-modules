import { writeFileSync, readdirSync, existsSync, readFileSync } from 'fs'
import path from 'path'

import { Argv, ArgumentsCamelCase } from 'yargs'

import { ExitCode } from './constants'
import Console from './utilities/Console'
import generateGlobal from './utilities/generateGlobal'
import generateGlobalFile, { getDefaultExportInfo } from './utilities/generateGlobalFile'
import generateIndex from './utilities/generateIndex'

const MODULE_EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx']

/**
 * Read separateModules from slice.json if it exists
 */
function getSeparateModules(basePath: string): string[] {
    const sliceJsonPath = path.join(basePath, 'slice.json')

    if (existsSync(sliceJsonPath)) {
        try {
            const sliceJson = JSON.parse(readFileSync(sliceJsonPath, 'utf-8'))
            return sliceJson.separateModules || []
        } catch {
            return []
        }
    }

    return []
}

/**
 * Check if directory contains module files
 */
function hasModuleFiles(dirPath: string): boolean {
    try {
        const files = readdirSync(dirPath)
        return files.some(file => {
            const isModule = MODULE_EXTENSIONS.some(ext => file.endsWith(ext))
            const isNotTest = !file.includes('.test.') && !file.includes('.spec.')
            const isNotIndex = !file.startsWith('index.')
            const isNotGlobal = !file.startsWith('global.')
            const isNotExample = !file.includes('.example.')
            return isModule && isNotTest && isNotIndex && isNotGlobal && isNotExample
        })
    } catch {
        return false
    }
}

/**
 * Check if directory contains .lite.* files
 */
function hasLiteFiles(dirPath: string): boolean {
    try {
        const files = readdirSync(dirPath)
        return files.some(file => file.includes('.lite.'))
    } catch {
        return false
    }
}

/**
 * Convert filename to valid JavaScript identifier
 * Replace hyphens and dots with underscores
 */
function toValidIdentifier(name: string): string {
    return name.replace(/[-.]/g, '_')
}

/**
 * Generate index.ts for a directory without config (scan files directly)
 */
function generateIndexForDirectory(
    dirPath: string,
    isLiteIndex = false,
    separateModules: string[] = []
): string {
    const fullPath = path.resolve(dirPath)
    const dirName = path.basename(fullPath)
    const entries = readdirSync(fullPath, { withFileTypes: true })
    const imports: string[] = []
    const exports: string[] = []

    // Collect directories first to avoid duplicates
    const directories = new Set(
        entries
            .filter(entry => entry.isDirectory() && !entry.name.startsWith('.'))
            .map(entry => entry.name)
    )

    for (const entry of entries) {
        // Skip hidden files and common exclusions
        if (entry.name.startsWith('.') || entry.name === 'node_modules') {
            continue
        }

        if (entry.isDirectory()) {
            // Skip directories in separateModules
            if (separateModules.includes(entry.name)) {
                continue
            }

            // Check if directory has index file
            const hasIndex = MODULE_EXTENSIONS.some(ext =>
                existsSync(path.join(fullPath, entry.name, `index${ext}`))
            )

            if (hasIndex) {
                exports.push(`export * from './${entry.name}'`)
            }
        } else {
            const isModule = MODULE_EXTENSIONS.some(ext => entry.name.endsWith(ext))
            const isNotTest = !entry.name.includes('.test.') && !entry.name.includes('.spec.')
            const isNotIndex = !entry.name.startsWith('index.')
            const isNotGlobal =
                !entry.name.startsWith('global.') && !entry.name.includes('.global.')
            const isNotInternal =
                !entry.name.includes('Internal') && !entry.name.includes('internal')
            const isNotExample = !entry.name.includes('.example.')
            const hasLite = entry.name.includes('.lite.')
            const isRecipe = entry.name.includes('.recipe.')
            const isContext = entry.name.includes('.context.')

            // For lite index: include only .lite.* files
            // For regular index: exclude .lite.* files
            if (isLiteIndex && !hasLite) {
                continue
            }
            if (!isLiteIndex && hasLite) {
                continue
            }

            if (
                !isModule ||
                !isNotTest ||
                !isNotIndex ||
                !isNotInternal ||
                !isNotExample ||
                isRecipe ||
                isContext
            ) {
                continue
            }

            // Handle .extension.*, .namespace.*, and .implementation.* files (side-effect imports)
            if (
                entry.name.includes('.extension.') ||
                entry.name.includes('.namespace.') ||
                entry.name.includes('.implementation.')
            ) {
                const baseName = entry.name.replace(/\.(ts|tsx|js|jsx)$/, '')
                imports.push(`import './${baseName}'`)
                continue
            }

            if (!isNotGlobal) {
                continue
            }

            // Get base name without extension
            const baseName = entry.name.replace(/\.(ts|tsx|js|jsx)$/, '')

            // Skip if there's a directory with same name
            if (directories.has(baseName)) {
                continue
            }

            // Check if file has default export
            const filePath = path.join(fullPath, entry.name)
            const { hasDefault, isTypeOnly } = getDefaultExportInfo(filePath)

            if (hasDefault) {
                // If file name matches directory name, export default as default
                if (baseName === dirName) {
                    if (isTypeOnly) {
                        exports.push(`export type { default } from './${baseName}'`)
                    } else {
                        exports.push(`export { default } from './${baseName}'`)
                    }
                } else {
                    // For .lite files, remove .lite suffix from exported name
                    const exportName = hasLite ? baseName.replace(/\.lite$/, '') : baseName
                    const validName = toValidIdentifier(exportName)

                    if (isTypeOnly) {
                        exports.push(`export type { default as ${validName} } from './${baseName}'`)
                    } else {
                        exports.push(`export { default as ${validName} } from './${baseName}'`)
                    }
                }
            }

            exports.push(`export * from './${baseName}'`)
        }
    }

    if (imports.length === 0 && exports.length === 0) {
        return '// No modules to export\n'
    }

    let content = '// Auto-generated index file\n\n'

    if (imports.length > 0) {
        content += imports.join('\n') + '\n\n'
    }

    if (exports.length > 0) {
        content += exports.join('\n') + '\n'
    }

    return content
}

/**
 * Generate global.ts for a directory without config (scan files directly)
 */
function generateGlobalForDirectory(dirPath: string, separateModules: string[] = []): string {
    const fullPath = path.resolve(dirPath)
    const entries = readdirSync(fullPath, { withFileTypes: true })
    const imports: string[] = []

    for (const entry of entries) {
        // Skip hidden files and common exclusions
        if (entry.name.startsWith('.') || entry.name === 'node_modules') {
            continue
        }

        if (entry.isDirectory()) {
            // Skip directories in separateModules
            if (separateModules.includes(entry.name)) {
                continue
            }

            // Check if directory has global.ts
            const globalPath = path.join(fullPath, entry.name, 'global.ts')

            if (existsSync(globalPath)) {
                imports.push(`import './${entry.name}/global'`)
            }
        } else {
            // Check for .global.*, .extension.*, .namespace.*, and .implementation.* files
            // Include both regular and .lite versions (e.g., .global.ts and .global.lite.ts)
            if (
                entry.name.endsWith('.global.ts') ||
                entry.name.endsWith('.extension.ts') ||
                entry.name.endsWith('.namespace.ts') ||
                entry.name.endsWith('.implementation.ts') ||
                entry.name.endsWith('.global.tsx') ||
                entry.name.endsWith('.extension.tsx') ||
                entry.name.endsWith('.namespace.tsx') ||
                entry.name.endsWith('.implementation.tsx') ||
                entry.name.endsWith('.global.js') ||
                entry.name.endsWith('.extension.js') ||
                entry.name.endsWith('.namespace.js') ||
                entry.name.endsWith('.implementation.js') ||
                entry.name.endsWith('.global.jsx') ||
                entry.name.endsWith('.extension.jsx') ||
                entry.name.endsWith('.namespace.jsx') ||
                entry.name.endsWith('.implementation.jsx') ||
                entry.name.endsWith('.global.lite.ts') ||
                entry.name.endsWith('.extension.lite.ts') ||
                entry.name.endsWith('.namespace.lite.ts') ||
                entry.name.endsWith('.implementation.lite.ts') ||
                entry.name.endsWith('.global.lite.tsx') ||
                entry.name.endsWith('.extension.lite.tsx') ||
                entry.name.endsWith('.namespace.lite.tsx') ||
                entry.name.endsWith('.implementation.lite.tsx')
            ) {
                const baseName = entry.name.replace(/\.(ts|tsx|js|jsx)$/, '')
                imports.push(`import './${baseName}'`)
            }
        }
    }

    if (imports.length === 0) {
        return '// No global files found\n'
    }

    // Sort imports for consistency
    imports.sort()

    return `// Auto-generated global imports\n\n${imports.join('\n')}\n`
}

/**
 * Recursively generate index.ts in all subdirectories with modules
 */
function generateIndexRecursive(
    basePath: string,
    depth = 0,
    isRoot = true,
    separateModules: string[] = []
): void {
    const fullPath = path.resolve(basePath)

    // Skip hidden directories and common exclusions
    const dirname = path.basename(fullPath)

    if (dirname.startsWith('.') || dirname === 'node_modules' || dirname === 'dist') {
        return
    }

    // Skip directories listed in separateModules
    if (!isRoot && separateModules.includes(dirname)) {
        return
    }

    const hasModules = hasModuleFiles(fullPath)
    const hasLite = hasLiteFiles(fullPath)

    if (hasModules) {
        try {
            let indexContent: string

            if (isRoot) {
                // Root directory - use config-based generation
                indexContent = generateIndex(basePath)
            } else {
                // Subdirectory - scan files directly
                indexContent = generateIndexForDirectory(fullPath, hasLite, separateModules)
            }

            // Use .lite.ts extension if directory contains .lite.* files
            const indexFileName = hasLite ? 'index.lite.ts' : 'index.ts'
            const indexPath = path.join(fullPath, indexFileName)
            writeFileSync(indexPath, indexContent)
            Console.log(`  ${'  '.repeat(depth)}✅ Generated ${indexFileName} for ${basePath}`)
        } catch (err) {
            Console.warn(`  ${'  '.repeat(depth)}⚠️  Skipped ${basePath}: ${err}`)
        }
    }

    // Recurse into subdirectories
    try {
        const entries = readdirSync(fullPath, { withFileTypes: true })

        for (const entry of entries) {
            if (entry.isDirectory()) {
                const subPath = path.join(basePath, entry.name)
                generateIndexRecursive(subPath, depth + 1, false, separateModules)
            }
        }
    } catch {
        // Ignore read errors
    }
}

/**
 * Recursively generate global.ts in all subdirectories with modules
 */
function generateGlobalRecursive(
    basePath: string,
    depth = 0,
    isRoot = true,
    separateModules: string[] = []
): void {
    const fullPath = path.resolve(basePath)

    // Skip hidden directories and common exclusions
    const dirname = path.basename(fullPath)

    if (dirname.startsWith('.') || dirname === 'node_modules' || dirname === 'dist') {
        return
    }

    // Skip directories listed in separateModules
    if (!isRoot && separateModules.includes(dirname)) {
        return
    }

    const hasModules = hasModuleFiles(fullPath)

    if (hasModules) {
        try {
            let globalContent: string

            if (isRoot) {
                // Root directory - use config-based generation
                globalContent = generateGlobal(basePath)
            } else {
                // Subdirectory - scan files directly
                globalContent = generateGlobalForDirectory(fullPath, separateModules)
            }

            // Always use global.ts (not global.lite.ts)
            const globalFileName = 'global.ts'
            const globalPath = path.join(fullPath, globalFileName)
            writeFileSync(globalPath, globalContent)
            Console.log(`  ${'  '.repeat(depth)}✅ Generated ${globalFileName} for ${basePath}`)
        } catch (err) {
            Console.warn(`  ${'  '.repeat(depth)}⚠️  Skipped ${basePath}: ${err}`)
        }
    }

    // Recurse into subdirectories
    try {
        const entries = readdirSync(fullPath, { withFileTypes: true })

        for (const entry of entries) {
            if (entry.isDirectory()) {
                const subPath = path.join(basePath, entry.name)
                generateGlobalRecursive(subPath, depth + 1, false, separateModules)
            }
        }
    } catch {
        // Ignore read errors
    }
}

/**
 * Recursively generate .global.ts files for all module files
 */
function generateGlobalFilesRecursive(
    basePath: string,
    depth = 0,
    isRoot = true,
    separateModules: string[] = []
): void {
    const fullPath = path.resolve(basePath)

    // Skip hidden directories and common exclusions
    const dirname = path.basename(fullPath)

    if (dirname.startsWith('.') || dirname === 'node_modules' || dirname === 'dist') {
        return
    }

    // Skip directories listed in separateModules
    if (!isRoot && separateModules.includes(dirname)) {
        return
    }

    try {
        const entries = readdirSync(fullPath, { withFileTypes: true })

        for (const entry of entries) {
            if (entry.isDirectory()) {
                // Recurse into subdirectories
                const subPath = path.join(basePath, entry.name)
                generateGlobalFilesRecursive(subPath, depth + 1, false, separateModules)
            } else {
                // Check if it's a module file that needs a .global.ts or .global.lite.ts
                const isModule = MODULE_EXTENSIONS.some(ext => entry.name.endsWith(ext))
                const isNotTest = !entry.name.includes('.test.') && !entry.name.includes('.spec.')
                const isNotIndex = !entry.name.startsWith('index.')
                const isNotGlobal =
                    !entry.name.includes('.global.') && !entry.name.startsWith('global.')
                const isNotExtension = !entry.name.includes('.extension.')
                const isNotNamespace = !entry.name.includes('.namespace.')
                const isNotImplementation = !entry.name.includes('.implementation.')
                const isNotInternal =
                    !entry.name.includes('Internal') && !entry.name.includes('internal')
                const isNotExample = !entry.name.includes('.example.')
                const isLite = entry.name.includes('.lite.')
                const isRecipe = entry.name.includes('.recipe.')
                const isContext = entry.name.includes('.context.')

                if (
                    isModule &&
                    isNotTest &&
                    isNotIndex &&
                    isNotGlobal &&
                    isNotExtension &&
                    isNotNamespace &&
                    isNotImplementation &&
                    isNotInternal &&
                    isNotExample &&
                    !isRecipe &&
                    !isContext
                ) {
                    const filePath = path.join(fullPath, entry.name)

                    // For .lite.* files: create .global.lite.ts
                    // For regular files: create .global.ts
                    let globalFilePath: string
                    if (isLite) {
                        // Button.lite.tsx -> Button.global.lite.ts
                        const baseName = entry.name.replace(/\.lite\.(ts|tsx|js|jsx)$/, '')
                        globalFilePath = path.join(fullPath, `${baseName}.global.lite.ts`)
                    } else {
                        // Button.tsx -> Button.global.ts
                        const baseName = entry.name.replace(/\.(ts|tsx|js|jsx)$/, '')
                        globalFilePath = path.join(fullPath, `${baseName}.global.ts`)
                    }

                    try {
                        const globalFileContent = generateGlobalFile(filePath)

                        // Skip if no content (only types/interfaces)
                        if (globalFileContent === null) {
                            Console.log(
                                `  ${'  '.repeat(depth)}⏭️  Skipped ${path.basename(globalFilePath)} (no value exports)`
                            )
                            continue
                        }

                        writeFileSync(globalFilePath, globalFileContent)
                        Console.log(
                            `  ${'  '.repeat(depth)}✅ Generated ${path.basename(globalFilePath)}`
                        )
                    } catch (err) {
                        Console.warn(
                            `  ${'  '.repeat(depth)}⚠️  Failed to generate ${path.basename(globalFilePath)}: ${err}`
                        )
                    }
                }
            }
        }
    } catch {
        // Ignore read errors
    }
}

export default function generate(yargs: Argv): Argv {
    return yargs
        .command(
            'index <path>',
            'Generate index.ts file',
            yargs =>
                yargs
                    .positional('path', {
                        describe: 'Path to module or slice',
                        type: 'string',
                        demandOption: true,
                    })
                    .option('recursive', {
                        alias: 'r',
                        describe: 'Recursively generate index.ts in all subdirectories',
                        type: 'boolean',
                        default: false,
                    }),
            async (argv: ArgumentsCamelCase<{ path: string; recursive?: boolean }>) => {
                try {
                    if (argv.recursive) {
                        Console.log(`🔨 Recursively generating index.ts for ${argv.path}`)
                        const separateModules = getSeparateModules(argv.path)
                        generateIndexRecursive(argv.path, 0, true, separateModules)
                        Console.log(`✅ Completed recursive generation`)
                    } else {
                        Console.log(`🔨 Generating index.ts for ${argv.path}`)
                        const indexContent = generateIndex(argv.path)
                        const indexPath = path.join(argv.path, 'index.ts')
                        writeFileSync(indexPath, indexContent)
                        Console.log(`✅ Generated index.ts for ${argv.path}`)
                    }
                } catch (err) {
                    Console.error(`❌ Failed to generate index.ts: ${err}`)
                    process.exit(ExitCode.BUILD_ERROR)
                }
            }
        )
        .command(
            'global <path>',
            'Generate global.ts file',
            yargs =>
                yargs
                    .positional('path', {
                        describe: 'Path to module or slice',
                        type: 'string',
                        demandOption: true,
                    })
                    .option('recursive', {
                        alias: 'r',
                        describe: 'Recursively generate global.ts in all subdirectories',
                        type: 'boolean',
                        default: false,
                    }),
            async (argv: ArgumentsCamelCase<{ path: string; recursive?: boolean }>) => {
                try {
                    if (argv.recursive) {
                        Console.log(`🔨 Recursively generating global.ts for ${argv.path}`)
                        const separateModules = getSeparateModules(argv.path)
                        generateGlobalRecursive(argv.path, 0, true, separateModules)
                        Console.log(`✅ Completed recursive generation`)
                    } else {
                        Console.log(`🔨 Generating global.ts for ${argv.path}`)
                        const globalContent = generateGlobal(argv.path)
                        const globalPath = path.join(argv.path, 'global.ts')
                        writeFileSync(globalPath, globalContent)
                        Console.log(`✅ Generated global.ts for ${argv.path}`)
                    }
                } catch (error) {
                    Console.error(`❌ Failed to generate global.ts: ${error}`)
                    process.exit(ExitCode.BUILD_ERROR)
                }
            }
        )
        .command(
            'global-files <path>',
            'Generate .global.ts files for all modules',
            yargs =>
                yargs.positional('path', {
                    describe: 'Path to scan for modules',
                    type: 'string',
                    demandOption: true,
                }),
            async (argv: ArgumentsCamelCase<{ path: string }>) => {
                try {
                    Console.log(`🔨 Generating .global.ts files for ${argv.path}`)
                    const separateModules = getSeparateModules(argv.path)
                    generateGlobalFilesRecursive(argv.path, 0, true, separateModules)
                    Console.log(`✅ Completed .global.ts files generation`)
                } catch (error) {
                    Console.error(`❌ Failed to generate .global.ts files: ${error}`)
                    process.exit(ExitCode.BUILD_ERROR)
                }
            }
        )
        .command(
            'meta <path>',
            'Generate index.ts, global.ts, and .global.ts files (all-in-one)',
            yargs =>
                yargs.positional('path', {
                    describe: 'Path to scan for modules',
                    type: 'string',
                    demandOption: true,
                }),
            async (argv: ArgumentsCamelCase<{ path: string }>) => {
                try {
                    Console.log(`🔨 Running meta generation for ${argv.path}`)
                    Console.log(``)

                    const separateModules = getSeparateModules(argv.path)

                    // Step 1: Generate .global.ts files
                    Console.log(`📝 Step 1/3: Generating .global.ts files`)
                    generateGlobalFilesRecursive(argv.path, 0, true, separateModules)
                    Console.log(``)

                    // Step 2: Generate index.ts files
                    Console.log(`📝 Step 2/3: Generating index.ts files`)
                    generateIndexRecursive(argv.path, 0, true, separateModules)
                    Console.log(``)

                    // Step 3: Generate global.ts files
                    Console.log(`📝 Step 3/3: Generating global.ts files`)
                    generateGlobalRecursive(argv.path, 0, true, separateModules)
                    Console.log(``)

                    Console.log(`✅ Completed meta generation`)
                } catch (error) {
                    Console.error(`❌ Failed meta generation: ${error}`)
                    process.exit(ExitCode.BUILD_ERROR)
                }
            }
        )
        .completion('completion', 'Generate completion for terminal')
        .demandCommand()
        .help()
}
