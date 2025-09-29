import { spawn } from 'child_process'
import { promises as fs } from 'fs'

import { Argv } from 'yargs'

import Console from './utilities/Console'
import generateMitosisComponents from './utilities/generateMitosisComponents'
import loadSkyConfig, { getAppConfig } from './utilities/loadSkyConfig'

export default function mitosis(yargs: Argv): Argv {
    return yargs
        .command(
            'dev <app-name>',
            'Clean and start watch mode',
            yargs =>
                yargs.positional('app-name', {
                    describe: 'Sky app name',
                    type: 'string',
                    demandOption: true,
                }),
            async argv => {
                try {
                    const skyConfig = await loadSkyConfig()

                    if (skyConfig == null) {
                        return
                    }

                    const skyAppConfig = getAppConfig(argv.appName, skyConfig)

                    if (skyAppConfig == null) {
                        return
                    }

                    Console.log('🚀 Starting mitosis development mode...')

                    // Clean first
                    const outputDir = 'generated-components'
                    await fs.rm(outputDir, { recursive: true, force: true })
                    await fs.mkdir(outputDir, { recursive: true })
                    Console.log('🧹 Cleaned generated components')

                    // Then start watch
                    Console.log('👀 Starting watch mode...')
                    // Check if app has its own config, otherwise use root config
                    const configPath = `${skyAppConfig.path}/mitosis.config.js`

                    const mitosisProcess = spawn(
                        'mitosis',
                        ['build', '--watch', `--config=${configPath}`],
                        {
                            stdio: 'inherit',
                            shell: true,
                        }
                    )

                    mitosisProcess.on('error', error => {
                        Console.error(`❌ Mitosis development mode failed: ${error}`)
                        process.exit(1)
                    })

                    mitosisProcess.on('exit', code => {
                        if (code !== 0) {
                            Console.error(`❌ Mitosis development mode exited with code ${code}`)
                            process.exit(1)
                        }
                    })

                    // Handle graceful shutdown
                    process.on('SIGINT', () => {
                        Console.log('\n🛑 Stopping mitosis development mode...')
                        mitosisProcess.kill('SIGINT')
                        process.exit(0)
                    })
                } catch (error) {
                    Console.error(`❌ Failed to start mitosis development mode: ${error}`)
                    process.exit(1)
                }
            }
        )
        .command(
            'build [app-name]',
            'Build mitosis components',
            yargs =>
                yargs.positional('app-name', {
                    describe: 'Sky app name',
                    type: 'string',
                    demandOption: true,
                }),
            async argv => {
                try {
                    const skyConfig = await loadSkyConfig()

                    if (skyConfig == null) {
                        return
                    }

                    const skyAppConfig = getAppConfig(argv.appName, skyConfig)

                    if (skyAppConfig == null) {
                        return
                    }

                    Console.log('🧹 Cleaning generated components...')

                    const outputDir = 'generated-components'
                    await fs.rm(outputDir, { recursive: true, force: true })
                    await fs.mkdir(outputDir, { recursive: true })

                    Console.log('✅ Generated components cleaned')

                    Console.log('🚀 Building mitosis components...')
                    await generateMitosisComponents(skyAppConfig.path)
                    Console.log('✅ Mitosis components built successfully')
                } catch (error) {
                    Console.error(`❌ Failed to build mitosis components: ${error}`)
                    process.exit(1)
                }
            }
        )
        .completion('completion', 'Generate completion for terminal')
        .demandCommand()
        .help()
}
