const MODULE_EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx']

// Regular expression for special file types (global, extension, namespace, implementation)
// Matches: .global.ts, .extension.lite.tsx, .namespace.js, etc.
const SPECIAL_FILE_PATTERN =
    /\.(global|extension|namespace|implementation)(\.(lite))?\.(ts|tsx|js|jsx)$/

export const filePredicates = {
    isModule: (name: string): boolean => MODULE_EXTENSIONS.some(ext => name.endsWith(ext)),
    isTest: (name: string): boolean => name.includes('.test.') || name.includes('.spec.'),
    isIndex: (name: string): boolean => name.startsWith('index.'),
    isGlobal: (name: string): boolean =>
        name.startsWith('global.') || name.includes('.global.'),
    isExtension: (name: string): boolean => name.includes('.extension.'),
    isNamespace: (name: string): boolean => name.includes('.namespace.'),
    isImplementation: (name: string): boolean => name.includes('.implementation.'),
    isInternal: (name: string): boolean => name.includes('Internal') || name.includes('internal'),
    isExample: (name: string): boolean => name.includes('.example.'),
    isRecipe: (name: string): boolean => name.includes('.recipe.'),
    isContext: (name: string): boolean => name.includes('.context.'),
    isLite: (name: string): boolean => name.includes('.lite.'),
    isJsxRuntime: (name: string): boolean =>
        name.startsWith('jsx-runtime.') || name.startsWith('jsx-dev-runtime.'),
    isSpecialFile: (name: string): boolean => SPECIAL_FILE_PATTERN.test(name),
}

export interface FileFilterOptions {
    includeTests?: boolean
    includeInternal?: boolean
    includeExamples?: boolean
    includeRecipes?: boolean
    includeContext?: boolean
}

export function shouldProcessFile(name: string, options: FileFilterOptions = {}): boolean {
    const {
        includeTests = false,
        includeInternal = false,
        includeExamples = false,
        includeRecipes = false,
        includeContext = false,
    } = options

    return (
        filePredicates.isModule(name) &&
        (includeTests || !filePredicates.isTest(name)) &&
        !filePredicates.isIndex(name) &&
        !filePredicates.isGlobal(name) &&
        (includeInternal || !filePredicates.isInternal(name)) &&
        (includeExamples || !filePredicates.isExample(name)) &&
        (includeRecipes || !filePredicates.isRecipe(name)) &&
        (includeContext || !filePredicates.isContext(name))
    )
}

export { MODULE_EXTENSIONS, SPECIAL_FILE_PATTERN }
