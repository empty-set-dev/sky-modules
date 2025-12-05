import fs from 'fs'
import path from 'path'

import Console from './utilities/Console'
import getUnixPath from './utilities/getUnixPath'

export default async function migrateConfig(): Promise<void> {
    Console.log('🔄 Migrating configuration structure...')

    // 1. Load old config
    const oldConfigPath = '.sky/sky.config.ts'

    if (!fs.existsSync(oldConfigPath)) {
        Console.error('❌ Old config not found at .sky/sky.config.ts')
        Console.log('Nothing to migrate!')
        return
    }

    const oldConfig = (await import(path.resolve(oldConfigPath))).default

    if (!oldConfig) {
        Console.error('❌ Failed to load old config')
        return
    }

    Console.log('✅ Loaded old config')

    // 2. Create workspace config
    const workspaceConfig = {
        name: oldConfig.name,
        id: oldConfig.id,
        scripts: oldConfig.scripts,
        folders: oldConfig.folders,
    }

    const workspaceConfigContent = `export default ${JSON.stringify(workspaceConfig, null, 4)} satisfies Sky.WorkspaceConfig
`

    fs.writeFileSync('sky-workspace.config.ts', workspaceConfigContent)

    Console.log('✅ Created sky-workspace.config.ts')

    // 3. Create module configs
    let moduleCount = 0

    for (const [name, module] of Object.entries(oldConfig.modules || {})) {
        try {
            await migrateModuleConfig(name, module as any)
            moduleCount++
        } catch (error) {
            Console.error(`❌ Failed to migrate module ${name}:`, error)
        }
    }

    Console.log(`✅ Created ${moduleCount} module configs`)

    // 4. Create app configs
    let appCount = 0

    for (const [name, app] of Object.entries({
        ...oldConfig.apps,
        ...oldConfig.playgrounds,
    })) {
        try {
            await migrateAppConfig(name, app as any)
            appCount++
        } catch (error) {
            Console.error(`❌ Failed to migrate app ${name}:`, error)
        }
    }

    Console.log(`✅ Created ${appCount} app configs`)

    Console.log('')
    Console.log('🎉 Migration complete!')
    Console.log('')
    Console.log('Next steps:')
    Console.log('1. Review generated configs (sky-workspace.config.ts and sky.config.ts files)')
    Console.log('2. Test that everything works: sky check')
    Console.log('3. Delete old config: rm -rf .sky/')
    Console.log('4. Commit changes')
}

async function migrateModuleConfig(name: string, module: any): Promise<void> {
    const modulePath = module.path || name
    const configPath = path.join(modulePath, 'sky.config.ts')

    // Skip external modules
    if (modulePath.includes('node_modules') || modulePath.startsWith('../')) {
        Console.log(`⏭️  Skipping external module: ${name}`)
        return
    }

    // Check if directory exists
    if (!fs.existsSync(modulePath)) {
        Console.warn(`⚠️  Module directory not found: ${modulePath}`)
        return
    }

    // Load slice.json if exists
    const sliceJsonPath = path.join(modulePath, 'slice.json')
    let sliceConfig = null

    if (fs.existsSync(sliceJsonPath)) {
        const sliceContent = fs.readFileSync(sliceJsonPath, 'utf-8')
        sliceConfig = JSON.parse(sliceContent)
    }

    // Create module config
    const moduleConfig: any = {
        id: module.id,
    }

    if (module.package) {
        moduleConfig.package = module.package
    }

    // Merge slice.json data
    if (sliceConfig) {
        moduleConfig.publishable = true
        moduleConfig.npm = {
            description: sliceConfig.description,
            keywords: sliceConfig.keywords,
            access: sliceConfig.access,
            modules: sliceConfig.modules,
            separateModules: sliceConfig.separateModules,
            dependencies: sliceConfig.dependencies,
            peerDependencies: sliceConfig.peerDependencies,
        }

        // Remove undefined fields
        Object.keys(moduleConfig.npm).forEach(key => {
            if (moduleConfig.npm[key] === undefined) {
                delete moduleConfig.npm[key]
            }
        })
    }

    const configContent = `export default ${JSON.stringify(moduleConfig, null, 4)} satisfies Sky.ModuleConfig
`

    fs.writeFileSync(configPath, configContent)

    Console.log(`📦 Created module config: ${modulePath}/sky.config.ts`)

    // Optionally backup slice.json
    if (sliceConfig) {
        fs.renameSync(sliceJsonPath, sliceJsonPath + '.backup')
        Console.log(`📦 Backed up slice.json to ${sliceJsonPath}.backup`)
    }
}

async function migrateAppConfig(name: string, app: any): Promise<void> {
    const appPath = app.path || name
    const configPath = path.join(appPath, 'sky.config.ts')

    // Skip external apps
    if (appPath.includes('node_modules') || appPath.startsWith('../')) {
        Console.log(`⏭️  Skipping external app: ${name}`)
        return
    }

    // Check if directory exists
    if (!fs.existsSync(appPath)) {
        Console.warn(`⚠️  App directory not found: ${appPath}`)
        return
    }

    // Create app config
    const appConfig: any = {
        id: app.id,
        target: app.target,
    }

    if (app.jsx) {
        appConfig.jsx = app.jsx
    }

    if (app.public) {
        appConfig.public = app.public
    }

    if (app.mitosis) {
        appConfig.mitosis = app.mitosis
    }

    const configContent = `export default ${JSON.stringify(appConfig, null, 4)} satisfies Sky.AppConfig
`

    fs.writeFileSync(configPath, configContent)

    Console.log(`📱 Created app config: ${appPath}/sky.config.ts`)
}
