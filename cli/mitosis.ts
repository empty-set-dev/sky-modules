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
                    generateConfig(skyAppConfig)
                    const configPath = `.dev/mitosis/${skyAppConfig.id}/mitosis.config.js`
                    const config = (await import(configPath)).default
                    fs.rmSync(config.dest, { recursive: true, force: true })
                    fs.mkdirSync(config.dest, { recursive: true })
                    Console.log('🧹 Cleaned generated components')

                    Console.log('👀 Starting watch mode...')

                    let mitosisProcess: ChildProcess

                    if (skyAppConfig.mitosis == null) {
                        throw Error(`no mitosis in ${skyAppConfig.id} app config`)
                    }

                    for (const module of skyAppConfig.mitosis) {
                        fs.watch(module, { recursive: true }, () => {
                            Console.clear()
                            Console.log('Build...')
                            runBuild()
                        })
                    }

                    Console.clear()
                    Console.log('Build...')
                    runBuild()

                    function runBuild(): void {
                        mitosisProcess && mitosisProcess.kill('SIGINT')
                        spawn('pkill', ['-f', '"mitosis build"'])
                        mitosisProcess = spawn('mitosis', ['build', `--config=${configPath}`], {
                            stdio: 'inherit',
                            shell: true,
                        })

                        mitosisProcess.on('close', () => {
                            post(config.dest)
                        })

                        mitosisProcess.on('error', error => {
                            Console.error(`❌ Mitosis process failed: ${error}`)
                        })

                        process.on('SIGINT', () => {
                            mitosisProcess.kill('SIGINT')
                            Console.log('\n🛑 Stopping mitosis development mode...')
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
                    generateConfig(skyAppConfig)
                    const configPath = `.dev/mitosis/${skyAppConfig.id}/mitosis.config.js`
                    const config = (await import(configPath)).default
                    fs.rmSync(config.dest, { recursive: true, force: true })
                    fs.mkdirSync(config.dest, { recursive: true })
                    Console.log('🧹 Cleaned generated components')

                    const mitosisProcess = spawn('mitosis', ['build', `--config=${configPath}`], {
                        stdio: 'inherit',
                        shell: true,
                    })

                    mitosisProcess.on('error', error => {
                        Console.error(`❌ Mitosis build failed: ${error}`)
                    })

                    mitosisProcess.on('close', code => {
                        post(config.dest)

                        if (code !== 0) {
                            Console.error(`❌ Mitosis build exited with code ${code}`)
                        }
                    })

                    // Handle graceful shutdown
                    process.on('SIGINT', () => {
                        mitosisProcess.kill('SIGINT')
                    })
                } catch (error) {
                    Console.error(`❌ Failed to start mitosis development mode: ${error}`)
                }
            }
        )
        .completion('completion', 'Generate completion for terminal')
        .demandCommand()
        .help()
}

function generateConfig(skyAppConfig: Sky.App): void {
    if (skyAppConfig.mitosis == null) {
        throw Error('no mitosis in app config')
    }

    fs.mkdirSync(`.dev/mitosis/${skyAppConfig.id}`, { recursive: true })
    fs.writeFileSync(
        `.dev/mitosis/${skyAppConfig.id}/mitosis.config.js`,
        `
            export default {
                files: [${skyAppConfig.mitosis.map(module => `'${module}/**/*.lite.*'`).join(', ')}],
                targets: ['react'],
                dest: '${`${skyAppConfig.path}/mitosis`}',
                extensions: ['.lite.ts', '.lite.tsx'],
                getTargetPath() {
                    return '.'
                },
                commonOptions: {
                    typescript: true,
                    explicitImportFileExtension: true,
                },
            }
        `
    )
}

function post(targetPath: string): void {
    const files = fs
        .readdirSync(targetPath, { recursive: true, encoding: 'utf8' })
        .filter(file => /\.lite\.(tsx?|jsx?|ts|js)$/.test(file))

    files.forEach(file => {
        const fullPath = `${targetPath}/${file}`
        const newFile = file.replace(/\.lite\./, '.')
        const newFullPath = `${targetPath}/${newFile}`

        try {
            fs.renameSync(fullPath, newFullPath)
        } catch (error) {
            Console.error(`❌ Failed to rename ${file}: ${error}`)
        }
    })
}
