/**
 * Build CSS from recipe.lite.ts files
 */

import { existsSync, readdirSync, writeFileSync } from 'fs'
import path from 'path'

import type { ArgumentsCamelCase } from 'yargs'

import { ExitCode } from './constants'
import Console from './utilities/Console'
import { generateCssFileFromRecipe } from './utilities/generateCssFromRecipe'
import { loadAppCofig } from './utilities/loadSkyConfig'

interface RecipeBuildArgs {
    appName: string
    input?: string
    output?: string
    watch?: boolean
}

/**
 * Find all recipe.lite.ts files in a directory recursively
 */
function findRecipeFiles(dir: string): string[] {
    const results: string[] = []

    try {
        const entries = readdirSync(dir, { withFileTypes: true })

        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name)

            // Skip node_modules and hidden directories
            if (entry.name === 'node_modules' || entry.name.startsWith('.')) {
                continue
            }

            if (entry.isDirectory()) {
                results.push(...findRecipeFiles(fullPath))
            } else if (entry.isFile() && entry.name.endsWith('.recipe.lite.ts')) {
                results.push(fullPath)
            }
        }
    } catch (error) {
        // Ignore errors (permission denied, etc.)
    }

    return results
}

/**
 * Build CSS from a single recipe file
 */
async function buildRecipeFile(recipeFilePath: string): Promise<void> {
    try {
        Console.info(`📦 Processing: ${path.basename(recipeFilePath)}`)

        const css = await generateCssFileFromRecipe(recipeFilePath)

        if (!css) {
            Console.error(`Failed to generate CSS for ${recipeFilePath}`)
            return
        }

        // Determine output path
        const outputPath = recipeFilePath.replace('.recipe.lite.ts', '.lite.css')

        writeFileSync(outputPath, css, 'utf-8')

        Console.success(`✨ Generated: ${path.basename(outputPath)}`)
    } catch (error) {
        Console.error(`Error processing ${recipeFilePath}: ${error}`)
    }
}

/**
 * Build CSS from recipe files
 */
export default async function recipeBuild(argv: ArgumentsCamelCase<RecipeBuildArgs>): Promise<void> {
    const { appName, input, watch } = argv

    Console.info(`🏗️  Building recipe CSS for ${appName}`)

    // Load app config
    const appConfigResult = await loadAppCofig(appName)

    if (!appConfigResult) {
        Console.error(`Failed to load app config for ${appName}`)
        process.exit(ExitCode.CONFIG_ERROR)
    }

    const [skyAppConfig] = appConfigResult

    // Determine search directory
    const searchDir = input || skyAppConfig.path

    if (!existsSync(searchDir)) {
        Console.error(`Directory not found: ${searchDir}`)
        process.exit(ExitCode.CONFIG_ERROR)
    }

    // Find all recipe files
    Console.info(`🔍 Searching for recipe files in: ${searchDir}`)
    const recipeFiles = findRecipeFiles(searchDir)

    if (recipeFiles.length === 0) {
        Console.warn(`No recipe.lite.ts files found in ${searchDir}`)
        return
    }

    Console.info(`Found ${recipeFiles.length} recipe file(s)`)

    // Process each recipe file
    for (const recipeFile of recipeFiles) {
        await buildRecipeFile(recipeFile)
    }

    Console.success(`\n✅ Successfully processed ${recipeFiles.length} recipe file(s)!`)

    // Watch mode
    if (watch) {
        Console.info(`\n👁️  Watch mode not yet implemented`)
        Console.info(`Run the command again to rebuild`)
    }
}
