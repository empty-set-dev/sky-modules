import { readdirSync } from 'fs'
import path from 'path'

import { shouldSkipDirectory } from './pathHelpers'

export interface RecursiveProcessorOptions {
    basePath: string
    depth?: number
    isRoot?: boolean
    separateModules?: string[]
    processDirectory: (fullPath: string, depth: number) => void
}

export function processDirectoryRecursively(options: RecursiveProcessorOptions): void {
    const { basePath, depth = 0, isRoot = true, separateModules = [], processDirectory } = options

    const fullPath = path.resolve(basePath)
    const dirname = path.basename(fullPath)

    // Check if we should skip this directory
    if (shouldSkipDirectory(dirname, isRoot, separateModules)) {
        return
    }

    // Process this directory with custom logic
    processDirectory(fullPath, depth)

    // Recurse into subdirectories
    try {
        const entries = readdirSync(fullPath, { withFileTypes: true })

        for (const entry of entries) {
            if (entry.isDirectory()) {
                processDirectoryRecursively({
                    basePath: path.join(basePath, entry.name),
                    depth: depth + 1,
                    isRoot: false,
                    separateModules,
                    processDirectory,
                })
            }
        }
    } catch {
        // Ignore read errors
    }
}
