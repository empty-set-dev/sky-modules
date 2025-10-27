// Shared helper functions for create commands
import fs from 'fs'
import path from 'path'

import cliPath from './cliPath'
import { extractModuleName } from './pathHelpers'
import replaceFileContents from './replaceFileContents'

/**
 * Rename a file, removing old file if new one already exists
 */
export function renameFile(filePath: string, newFilePath: string): void {
    if (fs.existsSync(`./${newFilePath}`)) {
        fs.rmSync(`./${filePath}`)
    } else {
        fs.renameSync(`./${filePath}`, `./${newFilePath}`)
    }
}

/**
 * Copy boilerplate directory to target path
 */
export function copyBoilerplate(
    boilerplateName: string,
    targetPath: string,
    boilerplatesDir?: string
): void {
    const baseDir = boilerplatesDir || path.resolve(cliPath, 'boilerplates')
    fs.cpSync(path.resolve(baseDir, boilerplateName), targetPath, {
        recursive: true,
        force: false,
    })
}

/**
 * Extract module name from path using consistent method
 */
export { extractModuleName }

/**
 * Replace file contents with variable substitutions
 */
export function replaceInFile(filePath: string, replacements: Record<string, string>): void {
    replaceFileContents(`./${filePath}`, replacements)
}
