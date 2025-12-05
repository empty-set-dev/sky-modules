import '../configuration/Sky.Workspace.namespace'

import fs from 'fs'
import path from 'path'

import Console from './Console'
import getUnixPath from './getUnixPath'

const cwd = process.cwd()

/**
 * Load workspace configuration from sky-workspace.config.ts
 */
export async function loadWorkspaceConfig(): Promise<Sky.WorkspaceConfig | null> {
    const configPath = findWorkspaceConfig()

    if (!configPath) {
        Console.error('missing "sky-workspace.config.ts"')
        return null
    }

    const parameters = (await import(getUnixPath(configPath))).default

    if (!parameters.name) {
        Console.error('missing name in "sky-workspace.config.ts"')
        return null
    }

    if (!parameters.id) {
        Console.error('missing id in "sky-workspace.config.ts"')
        return null
    }

    return parameters as Sky.WorkspaceConfig
}

/**
 * Find sky-workspace.config.ts by searching up from current directory
 */
export function findWorkspaceConfig(): string | null {
    function findIn(dir: string): string | null {
        const fullPath = path.join(dir, 'sky-workspace.config.ts')

        if (fs.existsSync(fullPath)) {
            return fullPath
        }

        const parent = path.dirname(dir)

        // Reached filesystem root
        if (parent === dir) {
            return null
        }

        return findIn(parent)
    }

    return findIn(cwd)
}

/**
 * Get workspace root directory
 */
export function getWorkspaceRoot(): string | null {
    const configPath = findWorkspaceConfig()
    return configPath ? path.dirname(configPath) : null
}
