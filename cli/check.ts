import { ArgumentsCamelCase } from 'yargs'

import Console from './utilities/Console'
import loadSkyConfig, { getModuleOrAppConfig } from './utilities/loadSkyConfig'
import run from './utilities/run'

export default async function check(
    argv: ArgumentsCamelCase<{ moduleName?: string }>
): Promise<void> {
    const skyConfig = await loadSkyConfig()

    if (!skyConfig) {
        return
    }

    try {
        if (argv.moduleName) {
            const config = getModuleOrAppConfig(argv.moduleName, skyConfig)

            if (!config) {
                return
            }

            await run(`npx tsc --noEmit --skipLibCheck --project ${config.path}/tsconfig.json`)
        } else {
            // Check all modules
            for (const [name, { config: module }] of skyConfig.modules.entries()) {
                Console.log(`check ${name}`)
                await run(`npx tsc --noEmit --skipLibCheck --project ${module.path}/tsconfig.json`)
                Console.log('')
            }

            // Check all apps
            for (const [name, { config: app }] of skyConfig.apps.entries()) {
                Console.log(`check ${name}`)
                await run(`npx tsc --noEmit --skipLibCheck --project ${app.path}/tsconfig.json`)
                Console.log('')
            }
        }
    } catch {
        //
    }
}
