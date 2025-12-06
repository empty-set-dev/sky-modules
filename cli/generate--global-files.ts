// Generate global/module.ts files for all modules
import { writeFileSync, readdirSync, mkdirSync, existsSync } from 'fs'
import path from 'path'

import { ArgumentsCamelCase } from 'yargs'

import { ExitCode } from './constants'
import Console from './utilities/Console'
import { discoverAllConfigs } from './utilities/discoverConfigs'
import { filePredicates } from './utilities/filePredicates'
import generateGlobalFile from './utilities/generateGlobalFile'
import { getSeparateModules, shouldSkipDirectory } from './utilities/generateHelpers'
import { getWorkspaceRoot } from './utilities/loadWorkspaceConfig'
import { removeExtension } from './utilities/pathHelpers'

/**
 * Recursively generate global/module.ts files for all module files
 */
function generateGlobalFilesRecursive(
    basePath: string,
    depth = 0,
    isRoot = true,
    separateModules: string[] = []
): void {
    const fullPath = path.resolve(basePath)
    const dirname = path.basename(fullPath)

    if (shouldSkipDirectory(dirname, isRoot, separateModules, fullPath)) {
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
                // Check if it's a module file that needs a global/module.ts file
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

                    // Get base name
                    const baseName = isLite
                        ? entry.name.replace(/\.lite\.(ts|tsx|js|jsx)$/, '')
                        : removeExtension(entry.name)

                    // Create global/ directory if it doesn't exist
                    const globalDir = path.join(fullPath, 'global')
                    if (!existsSync(globalDir)) {
                        mkdirSync(globalDir, { recursive: true })
                    }

                    // For .lite.* files: create global/module.lite.ts
                    // For regular files: create global/module.ts
                    const globalFileName = isLite ? `${baseName}.lite.ts` : `${baseName}.ts`
                    const globalFilePath = path.join(globalDir, globalFileName)

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
    argv: ArgumentsCamelCase<{ path?: string }>
): Promise<void> {
    try {
        // If path is provided, generate for that specific module
        if (argv.path) {
            // Check if module has generateGlobals enabled
            const modulePath = path.resolve(argv.path)
            const configPath = path.join(modulePath, 'sky.config.ts')

            if (existsSync(configPath)) {
                const config = (await import(configPath)).default
                if (!config.generateGlobals) {
                    Console.log(
                        `⏭️  Skipping ${argv.path}: generateGlobals is not enabled in config`
                    )
                    return
                }
            }

            Console.log(`🔨 Generating global/module.ts files for ${argv.path}`)
            const separateModules = getSeparateModules(argv.path)
            generateGlobalFilesRecursive(argv.path, 0, true, separateModules)
            Console.log(`✅ Completed global/module.ts files generation`)
            return
        }

        // If no path provided, generate for all modules with generateGlobals: true
        Console.log(
            `🔨 Generating global/module.ts files for all modules with generateGlobals enabled`
        )
        const workspaceRoot = getWorkspaceRoot()
        if (!workspaceRoot) {
            Console.error('❌ Workspace root not found')
            process.exit(ExitCode.BUILD_ERROR)
        }

        const { modules } = await discoverAllConfigs()
        let count = 0

        for (const [modulePath, discoveredModule] of modules.entries()) {
            if (discoveredModule.config.generateGlobals) {
                const fullPath = path.join(workspaceRoot, modulePath)
                Console.log(`\n📦 ${modulePath}`)
                const separateModules = getSeparateModules(fullPath)
                generateGlobalFilesRecursive(fullPath, 0, true, separateModules)
                count++
            }
        }

        Console.log(`\n✅ Completed global/module.ts files generation for ${count} module(s)`)
    } catch (error) {
        Console.error(`❌ Failed to generate global/module.ts files: ${error}`)
        process.exit(ExitCode.BUILD_ERROR)
    }
}
