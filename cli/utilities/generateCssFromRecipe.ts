/**
 * Generate CSS from Recipe files
 * Converts recipe.lite.ts files to .lite.css files
 */

import { existsSync, readFileSync } from 'fs'
import path from 'path'

interface RecipeVariant {
    [key: string]: string | [string, string]
}

interface RecipeDefinition {
    base?: string | [string, string]
    variants?: {
        [variantName: string]: RecipeVariant
    }
    compoundVariants?: Array<{
        [key: string]: string | boolean
        css?: string | [string, string]
    }>
    defaultVariants?: {
        [key: string]: string
    }
}

/**
 * Extract Tailwind classes from recipe value
 */
function extractTailwindClasses(value: string | [string, string]): string {
    if (typeof value === 'string') {
        return value
    }
    // Array format: [className, tailwindClasses]
    return value[1] || ''
}

/**
 * Extract CSS class name from recipe value
 */
function extractClassName(value: string | [string, string]): string {
    if (typeof value === 'string') {
        return value
    }
    // Array format: [className, tailwindClasses]
    return value[0] || ''
}

/**
 * Generate CSS from recipe definition
 */
export function generateCssFromRecipe(
    recipe: RecipeDefinition,
    recipeName: string
): string {
    let css = ''

    // Add header
    css += `@reference '~x/design-system/index.css';\n\n`
    css += `@layer utilities {\n`

    // Generate base styles
    if (recipe.base) {
        const baseClasses = extractTailwindClasses(recipe.base)
        if (baseClasses.trim()) {
            css += `    :where(.${recipeName}) {\n`
            // Split classes and add @apply for each line
            const lines = baseClasses.trim().split('\n').map(line => line.trim()).filter(Boolean)
            for (const line of lines) {
                if (line) {
                    css += `        @apply ${line};\n`
                }
            }
            css += `    }\n\n`
        }
    }

    // Generate variant styles
    if (recipe.variants) {
        for (const [variantName, variantValues] of Object.entries(recipe.variants)) {
            for (const [variantKey, variantValue] of Object.entries(variantValues)) {
                const className = extractClassName(variantValue)
                const tailwindClasses = extractTailwindClasses(variantValue)

                if (tailwindClasses.trim()) {
                    // Use the class name from the array if provided, otherwise generate from variant
                    const finalClassName = className || `${recipeName}--${variantKey}`

                    css += `    :where(.${finalClassName}) {\n`

                    // Split classes and add @apply for each line
                    const lines = tailwindClasses.trim().split('\n').map(line => line.trim()).filter(Boolean)
                    for (const line of lines) {
                        if (line) {
                            css += `        @apply ${line};\n`
                        }
                    }

                    css += `    }\n\n`
                }
            }
        }
    }

    // Generate compound variant styles
    if (recipe.compoundVariants) {
        for (const compound of recipe.compoundVariants) {
            const { css: compoundCss, ...conditions } = compound

            if (compoundCss) {
                const tailwindClasses = extractTailwindClasses(compoundCss)

                if (tailwindClasses.trim()) {
                    // Build selector from conditions - use :where() for each condition
                    const selectors = Object.entries(conditions)
                        .map(([key, value]) => {
                            if (typeof value === 'boolean' && value) {
                                return `:where(.${recipeName}--${key})`
                            }
                            if (typeof value === 'string') {
                                return `:where(.${recipeName}--${value})`
                            }
                            return null
                        })
                        .filter(Boolean)
                        .join('')

                    if (selectors) {
                        css += `    ${selectors} {\n`

                        const lines = tailwindClasses.trim().split('\n').map(line => line.trim()).filter(Boolean)
                        for (const line of lines) {
                            if (line) {
                                css += `        @apply ${line};\n`
                            }
                        }

                        css += `    }\n\n`
                    }
                }
            }
        }
    }

    css += `}\n`

    return css
}

/**
 * Load and parse recipe file
 */
export async function loadRecipeFile(filePath: string): Promise<RecipeDefinition | null> {
    try {
        // For .ts files, we need to parse the source since they can't be imported directly
        // without compilation
        return parseRecipeFromSource(filePath)
    } catch (error) {
        console.error(`Error loading recipe from ${filePath}:`, error)
        return null
    }
}

/**
 * Parse recipe definition from source code
 */
function parseRecipeFromSource(filePath: string): RecipeDefinition | null {
    try {
        const source = readFileSync(filePath, 'utf-8')

        // Remove import statements and exports to isolate the recipe object
        const cleanedSource = source
            .replace(/import\s+.*?from\s+['"].*?['"]/g, '')
            .replace(/export\s+/g, '')

        // Extract the recipe call content - match the opening brace and find its closing brace
        const recipeStartMatch = cleanedSource.match(/recipe\s*\(\s*{/)
        if (!recipeStartMatch) {
            console.warn(`No recipe() call found in ${filePath}`)
            return null
        }

        const startIndex = recipeStartMatch.index! + recipeStartMatch[0].length - 1
        let braceCount = 1
        let endIndex = startIndex + 1

        // Find the matching closing brace
        while (endIndex < cleanedSource.length && braceCount > 0) {
            const char = cleanedSource[endIndex]
            if (char === '{') braceCount++
            if (char === '}') braceCount--
            endIndex++
        }

        const recipeContent = cleanedSource.substring(startIndex, endIndex)

        // This is a simplified parser - using eval in build-time context only
        // In production, consider using @babel/parser or typescript compiler API
        try {
            const recipeConfig = eval(`(${recipeContent})`)
            return recipeConfig as RecipeDefinition
        } catch (evalError) {
            console.error(`Error evaluating recipe config: ${evalError}`)
            console.error(`Content: ${recipeContent.substring(0, 200)}...`)
            return null
        }
    } catch (error) {
        console.error(`Error parsing recipe source from ${filePath}:`, error)
        return null
    }
}

/**
 * Generate CSS file from recipe.lite.ts file
 */
export async function generateCssFileFromRecipe(recipeFilePath: string): Promise<string | null> {
    if (!existsSync(recipeFilePath)) {
        console.error(`Recipe file not found: ${recipeFilePath}`)
        return null
    }

    // Extract component name from filename
    // e.g., Button.recipe.lite.ts -> Button
    const filename = path.basename(recipeFilePath)
    const componentName = filename.replace('.recipe.lite.ts', '')

    // Load recipe definition
    const recipe = await loadRecipeFile(recipeFilePath)
    if (!recipe) {
        return null
    }

    // Generate CSS
    const css = generateCssFromRecipe(recipe, componentName.toLowerCase())

    return css
}
