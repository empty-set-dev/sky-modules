import { ArgumentsCamelCase } from 'yargs'

import Console from './lib/Console'
import loadSkyConfig, { getAppConfig } from './lib/loadSkyConfig'
import run from './lib/run'
import skyPath from './lib/skyPath'

export default async function check(
    argv: ArgumentsCamelCase<{ moduleName?: string }>
): Promise<void> {
    const skyConfig = await loadSkyConfig()

    if (!skyConfig) {
        return
    }

    try {
        if (argv.moduleName) {
            const skyAppConfig = getAppConfig(argv.moduleName, skyConfig)

            if (!skyAppConfig) {
                return
            }

            await run(
                `${skyPath}/node_modules/.bin/tsc --noEmit --skipLibCheck --project ${argv.moduleName}/tsconfig.json`
            )
        } else {
            for (const name of Object.keys(skyConfig.modules)) {
                const module = skyConfig.modules[name]
                Console.log(`check ${name}`)
                await run(
                    `${skyPath}/node_modules/.bin/tsc --noEmit --skipLibCheck --project ${module.path}/tsconfig.json`
                )
                Console.log('')
            }

            for (const name of Object.keys(skyConfig.examples)) {
                const example = skyConfig.examples[name]
                Console.log(`check ${name}`)
                await run(
                    `${skyPath}/node_modules/.bin/tsc --noEmit --skipLibCheck --project ${example.path}/tsconfig.json`
                )
                Console.log('')
            }

            for (const name of Object.keys(skyConfig.apps)) {
                const app = skyConfig.examples[name]
                Console.log(`check ${name}`)
                await run(
                    `${skyPath}/node_modules/.bin/tsc --noEmit --skipLibCheck --project ${app.path}/tsconfig.json`
                )
                Console.log('')
            }
        }
    } catch {
        //
    }
}
