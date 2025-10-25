// Generate index.ts files
import { writeFileSync, readdirSync } from 'fs'
import path from 'path'

import { ArgumentsCamelCase } from 'yargs'

import { ExitCode } from './constants'
import Console from './utilities/Console'
import {
    generateIndexForDirectory,
    getSeparateModules,
    hasLiteFiles,
    hasModuleFiles,
    shouldSkipDirectory,
} from './utilities/generateHelpers'
import generateIndex from './utilities/generateIndex'

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
    const dirname = path.basename(fullPath)

    if (shouldSkipDirectory(dirname, isRoot, separateModules)) {
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
    } catch (err) {
        Console.warn(`  ${'  '.repeat(depth)}⚠️  Failed to read directory ${fullPath}: ${err}`)
    }
}

export default async function generateIndexCommand(
    argv: ArgumentsCamelCase<{ path: string; recursive?: boolean }>
): Promise<void> {
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
