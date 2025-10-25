// Generate global.ts files
import { writeFileSync, readdirSync } from 'fs'
import path from 'path'

import { ArgumentsCamelCase } from 'yargs'

import { ExitCode } from './constants'
import Console from './utilities/Console'
import generateGlobal from './utilities/generateGlobal'
import {
    generateGlobalForDirectory,
    getSeparateModules,
    hasModuleFiles,
    shouldSkipDirectory,
} from './utilities/generateHelpers'

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
    const dirname = path.basename(fullPath)

    if (shouldSkipDirectory(dirname, isRoot, separateModules)) {
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
    } catch (err) {
        Console.warn(`  ${'  '.repeat(depth)}⚠️  Failed to read directory ${fullPath}: ${err}`)
    }
}

export default async function generateGlobalCommand(
    argv: ArgumentsCamelCase<{ path: string; recursive?: boolean }>
): Promise<void> {
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
