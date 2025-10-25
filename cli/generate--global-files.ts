// Generate .global.ts files for all modules
import { writeFileSync, readdirSync } from 'fs'
import path from 'path'

import { ArgumentsCamelCase } from 'yargs'

import { ExitCode } from './constants'
import Console from './utilities/Console'
import { filePredicates } from './utilities/filePredicates'
import generateGlobalFile from './utilities/generateGlobalFile'
import { getSeparateModules, shouldSkipDirectory } from './utilities/generateHelpers'
import { removeExtension } from './utilities/pathHelpers'

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
    const dirname = path.basename(fullPath)

    if (shouldSkipDirectory(dirname, isRoot, separateModules)) {
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
                const isLite = filePredicates.isLite(entry.name)

                if (
                    filePredicates.isModule(entry.name) &&
                    !filePredicates.isTest(entry.name) &&
                    !filePredicates.isIndex(entry.name) &&
                    !filePredicates.isGlobal(entry.name) &&
                    !filePredicates.isExtension(entry.name) &&
                    !filePredicates.isNamespace(entry.name) &&
                    !filePredicates.isImplementation(entry.name) &&
                    !filePredicates.isInternal(entry.name) &&
                    !filePredicates.isExample(entry.name) &&
                    !filePredicates.isRecipe(entry.name) &&
                    !filePredicates.isContext(entry.name)
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
                        const baseName = removeExtension(entry.name)
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
    } catch (err) {
        Console.warn(`  ${'  '.repeat(depth)}⚠️  Failed to read directory ${fullPath}: ${err}`)
    }
}

export default async function generateGlobalFilesCommand(
    argv: ArgumentsCamelCase<{ path: string }>
): Promise<void> {
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
