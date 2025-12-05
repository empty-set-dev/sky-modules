// Path and file system constants and utilities

// Directory exclusions
export const EXCLUDED_DIRS = ['.', 'node_modules', 'dist']

// Ignore patterns for testing and file processing
export const IGNORED_PATTERNS = ['**/node_modules/**', '**/.dev/**', '**/boilerplates/**']

// Regular expressions for file processing
export const MODULE_EXTENSION_REGEX = /\.(ts|tsx|js|jsx)$/
export const PATH_SEPARATOR_REGEX = /^.*(\\|\/|:)/

/**
 * Extract module name from a file path
 * @example extractModuleName('src/components/Button') -> 'Button'
 * @example extractModuleName('src\\components\\Button') -> 'Button'
 */
export function extractModuleName(filePath: string): string {
    return filePath.replace(PATH_SEPARATOR_REGEX, '')
}

/**
 * Remove file extension from a filename
 * @example removeExtension('Button.tsx') -> 'Button'
 * @example removeExtension('index.ts') -> 'index'
 */
export function removeExtension(filename: string): string {
    return filename.replace(MODULE_EXTENSION_REGEX, '')
}

/**
 * Check if a directory should be skipped during traversal
 * @param dirname Directory name to check
 * @param isRoot Whether this is the root directory
 * @param separateModules List of modules to skip
 * @param fullPath Optional full path for additional checks
 */
export function shouldSkipDirectory(
    dirname: string,
    isRoot: boolean,
    separateModules: string[] = [],
    fullPath?: string
): boolean {
    // Skip hidden directories and common exclusions
    if (dirname.startsWith('.') || dirname === 'node_modules' || dirname === 'dist' || dirname === 'x') {
        return true
    }

    // Skip global directory to prevent nested global/global
    if (dirname === 'global') {
        return true
    }

    // Skip application/example/cli directories at root level
    if (dirname === 'playground' || dirname === 'pkgs' || dirname === 'cli') {
        return true
    }

    // Skip example/demo directories
    if (dirname.includes('example') || dirname.includes('demo') || dirname.includes('boilerplate')) {
        return true
    }

    // Check full path if provided - skip if inside playground, pkgs, or cli (but NOT modules)
    if (fullPath) {
        const normalizedPath = fullPath.replace(/\\/g, '/')
        if (
            normalizedPath.includes('/playground/') ||
            normalizedPath.includes('/pkgs/') ||
            normalizedPath.includes('/cli/')
        ) {
            return true
        }
    }

    // Skip directories listed in separateModules
    if (!isRoot && separateModules.includes(dirname)) {
        return true
    }

    return false
}
