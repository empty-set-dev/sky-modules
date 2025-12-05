import '../configuration/Sky.App.namespace'
import '../configuration/Sky.Module.namespace'

import fs from 'fs'
import path from 'path'

import Console from './Console'
import getUnixPath from './getUnixPath'
import { getWorkspaceRoot } from './loadWorkspaceConfig'

export interface DiscoveredModule {
    path: string
    config: Sky.Module
}

export interface DiscoveredApp {
    path: string
    config: Sky.App
}

/**
 * Auto-discover all modules and apps by scanning for sky.config.ts files
 */
export async function discoverAllConfigs(): Promise<{
    modules: Map<string, DiscoveredModule>
    apps: Map<string, DiscoveredApp>
}> {
    const workspaceRoot = getWorkspaceRoot()

    if (!workspaceRoot) {
        throw new Error('Workspace root not found')
    }

    const modules = new Map<string, DiscoveredModule>()
    const apps = new Map<string, DiscoveredApp>()

    await scanDirectory(workspaceRoot, modules, apps, workspaceRoot)

    return { modules, apps }
}

/**
 * Recursively scan directory for sky.config.ts files
 */
async function scanDirectory(
    dir: string,
    modules: Map<string, DiscoveredModule>,
    apps: Map<string, DiscoveredApp>,
    workspaceRoot: string
): Promise<void> {
    let entries: fs.Dirent[]

    try {
        entries = fs.readdirSync(dir, { withFileTypes: true })
    } catch (error) {
        // Skip directories we can't read
        return
    }

    for (const entry of entries) {
        // Skip hidden directories, node_modules, .dev, docs
        if (
            entry.name.startsWith('.') ||
            entry.name === 'node_modules' ||
            entry.name === 'docs' ||
            entry.name === '.dev'
        ) {
            continue
        }

        if (!entry.isDirectory()) {
            continue
        }

        const fullPath = path.join(dir, entry.name)
        const configPath = path.join(fullPath, 'sky.config.ts')

        // Check for sky.config.ts
        if (fs.existsSync(configPath)) {
            try {
                const config = (await import(getUnixPath(configPath))).default
                const relativePath = path.relative(workspaceRoot, fullPath)

                // Determine if module or app by checking config structure
                if (isAppConfig(config)) {
                    const app: Sky.App = {
                        ...config,
                        path: relativePath,
                    }

                    apps.set(relativePath, {
                        path: relativePath,
                        config: app,
                    })
                } else if (isModuleConfig(config)) {
                    const module: Sky.Module = {
                        ...config,
                        path: relativePath,
                    }

                    modules.set(relativePath, {
                        path: relativePath,
                        config: module,
                    })
                } else {
                    Console.warn(
                        `⚠️  Invalid config at ${relativePath}: missing required fields (id, target for apps)`
                    )
                }
            } catch (error) {
                Console.error(`❌ Failed to load config at ${relativePath}:`, error)
            }

            // Don't scan subdirectories if we found a config
            // (stop at first sky.config.ts)
            continue
        }

        // Recursively scan subdirectories
        await scanDirectory(fullPath, modules, apps, workspaceRoot)
    }
}

/**
 * Check if config is an app config (has target field)
 */
function isAppConfig(config: unknown): config is Sky.AppConfig {
    return typeof config === 'object' && config !== null && 'target' in config
}

/**
 * Check if config is a module config (has id but no target)
 */
function isModuleConfig(config: unknown): config is Sky.ModuleConfig {
    return (
        typeof config === 'object' &&
        config !== null &&
        'id' in config &&
        !('target' in config)
    )
}
