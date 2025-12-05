import '../configuration/Sky.App.namespace'
import '../configuration/Sky.Config.namespace'
import '../configuration/Sky.Module.namespace'
import '../configuration/Sky.Workspace.namespace'

import Console from './Console'
import { discoverAllConfigs } from './discoverConfigs'
import { loadWorkspaceConfig } from './loadWorkspaceConfig'

/**
 * New config structure
 */
export interface SkyConfig {
    workspace: Sky.WorkspaceConfig
    modules: Map<string, Sky.Module>
    apps: Map<string, Sky.App>
}

/**
 * Load complete Sky configuration (workspace + discovered modules/apps)
 */
export default async function loadSkyConfig(): Promise<SkyConfig | null> {
    const workspace = await loadWorkspaceConfig()

    if (!workspace) {
        return null
    }

    const { modules, apps } = await discoverAllConfigs()

    return {
        workspace,
        modules,
        apps,
    }
}

/**
 * Load app config by name (path)
 */
export async function loadAppCofig(appName: string): Promise<null | [Sky.App, SkyConfig]> {
    const skyConfig = await loadSkyConfig()

    if (!skyConfig) {
        return null
    }

    const skyAppConfig = getAppConfig(appName, skyConfig)

    if (!skyAppConfig) {
        return null
    }

    return [skyAppConfig, skyConfig]
}

/**
 * Get module or app config by name (path)
 */
export function getModuleOrAppConfig(name: string, config: SkyConfig): Sky.Module | Sky.App | null {
    return config.modules.get(name) ?? config.apps.get(name) ?? null
}

/**
 * Get app config by name (path) with validation
 */
export function getAppConfig(name: string, config: SkyConfig): Sky.App | null {
    const app = config.apps.get(name)

    if (!app) {
        Console.error(`${name}: missing app in workspace`)
        return null
    }

    // Validate required fields
    if (!app.target) {
        Console.error(`${name}: missing app target`)
        return null
    }

    if ((app.target === 'web' || app.target === 'universal') && !app.public) {
        Console.error(`${name}: missing app public`)
        return null
    }

    return app
}

/**
 * Get module config by name (path)
 */
export function getModuleConfig(name: string, config: SkyConfig): Sky.Module | null {
    const module = config.modules.get(name)

    if (!module) {
        Console.error(`${name}: missing module in workspace`)
        return null
    }

    return module
}

// Deprecated - kept for compatibility during migration
export function findSkyConfig(): null | string {
    Console.warn('findSkyConfig() is deprecated, config structure has changed')
    return null
}
