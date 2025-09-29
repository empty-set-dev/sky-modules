import { ChildProcess, spawn } from 'child_process'
import fs from 'fs'

import { Argv } from 'yargs'

import Console from './utilities/Console'
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
                    const config = (await import(`${skyAppConfig.path}/mitosis.config.js`)).default
                    fs.rmSync(config.dest, { recursive: true, force: true })
                    fs.mkdirSync(config.dest, { recursive: true })
                    Console.log('🧹 Cleaned generated components')

                    Console.log('👀 Starting watch mode...')
                    const configPath = `${skyAppConfig.path}/mitosis.config.js`

                    let mitosisProcess: ChildProcess

                    fs.watch('universal', { recursive: true }, () => {
                        Console.log('Build...')
                        runBuild()
                    })

                    runBuild()

                    function runBuild(): void {
                        mitosisProcess && mitosisProcess.kill('SIGINT')
                        spawn('pkill', ['-f', '"mitosis build"'])
                        mitosisProcess = spawn(
                            'mitosis',
                            ['build', `--config=${configPath}`, '--max-workers=2'],
                            {
                                stdio: 'inherit',
                                shell: true,
                            }
                        )

                        // Handle graceful shutdown
                        process.on('SIGINT', () => {
                            Console.log('\n🛑 Stopping mitosis development mode...')
                            spawn('pkill', ['-f', '"mitosis build"'])
                        })
                    }
                } catch (error) {
                    Console.error(`❌ Failed to start mitosis development mode: ${error}`)
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

                    Console.log('🚀 Starting mitosis build...')

                    // Clean first
                    const config = (await import(`${skyAppConfig.path}/mitosis.config.js`)).default
                    fs.rmSync(config.dest, { recursive: true, force: true })
                    fs.mkdirSync(config.dest, { recursive: true })
                    Console.log('🧹 Cleaned generated components')

                    const configPath = `${skyAppConfig.path}/mitosis.config.js`
                    const mitosisProcess = spawn('mitosis', ['build', `--config=${configPath}`], {
                        stdio: 'inherit',
                        shell: true,
                    })

                    mitosisProcess.on('error', error => {
                        Console.error(`❌ Mitosis build failed: ${error}`)
                    })

                    mitosisProcess.on('exit', code => {
                        if (code !== 0) {
                            Console.error(`❌ Mitosis build exited with code ${code}`)
                        }
                    })

                    // Handle graceful shutdown
                    process.on('SIGINT', () => {
                        Console.log('\n🛑 Stopping mitosis development mode...')
                        mitosisProcess.kill('SIGINT')
                    })
                } catch (error) {
                    Console.error(`❌ Failed to start mitosis development mode: ${error}`)
                    process.exit(1)
                }
            }
        )
        .completion('completion', 'Generate completion for terminal')
        .demandCommand()
        .help()
}
