import { ChildProcess, spawn } from 'child_process'
import fs from 'fs'
import path from 'path'

import { Argv } from 'yargs'

import { MitosisCache } from './mitosis/cache'
import { HookPostProcessor } from './mitosis/hook-post-processor'
import cliPath from './utilities/cliPath'
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
                    const configPath = path.resolve(
                        `.dev/mitosis/${skyAppConfig.id}/mitosis.config.js`
                    )
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
                        const buildStartTime = Date.now()
                        mitosisProcess && mitosisProcess.kill('SIGINT')
                        spawn('pkill', ['-f', '"mitosis build"'])
                        mitosisProcess = spawn(
                            'npx',
                            ['mitosis', 'build', `--config=${configPath}`],
                            {
                                stdio: 'inherit',
                                shell: true,
                            }
                        )

                        mitosisProcess.on('close', () => {
                            if (skyAppConfig) {
                                post(config.dest, skyAppConfig)
                            }

                            const buildEndTime = Date.now()
                            const buildDuration = ((buildEndTime - buildStartTime) / 1000).toFixed(
                                2
                            )
                            Console.log(`✅ Build completed in ${buildDuration}s`)
                        })

                        mitosisProcess.on('error', error => {
                            Console.error(`❌ Mitosis process failed: ${error}`)
                        })

                        process.on('SIGINT', () => {
                            mitosisProcess.kill('SIGINT')
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
                yargs
                    .positional('app-name', {
                        describe: 'Sky app name',
                        type: 'string',
                        demandOption: true,
                    })
                    .option('force', {
                        alias: 'f',
                        type: 'boolean',
                        description: 'Force rebuild all files, ignoring cache',
                        default: false,
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
                    const startTime = Date.now()

                    // Initialize cache
                    const cache = new MitosisCache(`.dev/mitosis/${skyAppConfig.id}`)
                    const allLiteFiles = getAllLiteFiles(skyAppConfig.mitosis || [])

                    if (argv.force) {
                        Console.log('🔄 Force rebuild requested, ignoring cache')
                        cache.clearCache()
                    } else {
                        const changedFiles = cache.getChangedFiles(allLiteFiles)

                        if (changedFiles.length === 0) {
                            Console.log('✅ No files changed, skipping build')
                            return
                        }

                        Console.log(
                            `📁 Found ${changedFiles.length} changed files out of ${allLiteFiles.length} total`
                        )
                    }

                    // Generate config with only changed files for incremental build
                    const changedFiles = argv.force
                        ? allLiteFiles
                        : cache.getChangedFiles(allLiteFiles)
                    generateConfig(skyAppConfig, changedFiles)
                    const configPath = path.resolve(
                        `.dev/mitosis/${skyAppConfig.id}/mitosis.config.js`
                    )
                    const config = (await import(configPath)).default

                    // Ensure destination directory exists
                    if (!fs.existsSync(config.dest)) {
                        fs.mkdirSync(config.dest, { recursive: true })
                    }

                    // Only clean generated files for changed source files in incremental mode
                    if (!argv.force) {
                        const changedFiles = cache.getChangedFiles(allLiteFiles)
                        cleanChangedComponents(
                            config.dest,
                            changedFiles,
                            skyAppConfig.mitosis || []
                        )
                        Console.log(`🧹 Cleaned ${changedFiles.length} changed components`)
                    } else {
                        // Full clean for force rebuild
                        fs.rmSync(config.dest, { recursive: true, force: true })
                        fs.mkdirSync(config.dest, { recursive: true })
                        Console.log('🧹 Cleaned all components (force rebuild)')
                    }

                    const mitosisProcess = spawn(
                        'npx',
                        ['mitosis', 'build', `--config=${configPath}`],
                        {
                            stdio: 'inherit',
                            shell: true,
                        }
                    )

                    mitosisProcess.on('error', error => {
                        Console.error(`❌ Mitosis build failed: ${error}`)
                    })

                    mitosisProcess.on('close', code => {
                        if (skyAppConfig) {
                            post(config.dest, skyAppConfig)
                        }

                        const endTime = Date.now()
                        const duration = ((endTime - startTime) / 1000).toFixed(2)

                        if (code !== 0) {
                            Console.error(`❌ Mitosis build exited with code ${code}`)
                        } else {
                            // Mark all files as processed in cache
                            allLiteFiles.forEach(file => cache.markFileProcessed(file))
                            Console.log(`✅ Mitosis build completed successfully in ${duration}s`)
                        }
                    })

                    // Handle graceful shutdown
                    process.on('SIGINT', () => {
                        mitosisProcess.kill('SIGINT')
                    })
                } catch (error) {
                    Console.error(`❌ Failed to build mitosis: ${error}`)
                }
            }
        )
        .completion('completion', 'Generate completion for terminal')
        .demandCommand()
        .help()
}

function getAllLiteFiles(directories: string[]): string[] {
    const files: string[] = []

    function searchDirectory(dir: string): void {
        try {
            const entries = fs.readdirSync(dir, { withFileTypes: true })

            for (const entry of entries) {
                const fullPath = path.join(dir, entry.name)

                if (entry.isDirectory()) {
                    // Skip node_modules and other build directories
                    if (
                        entry.name === 'node_modules' ||
                        entry.name === '.dev' ||
                        entry.name === 'x'
                    ) {
                        continue
                    }

                    searchDirectory(fullPath)
                } else if (entry.isFile()) {
                    if (entry.name.match(/\.lite\.(ts|tsx)$/)) {
                        files.push(fullPath)
                    }
                }
            }
        } catch {
            // Ignore directory read errors
        }
    }

    directories.forEach(dir => {
        if (fs.existsSync(dir)) {
            searchDirectory(dir)
        }
    })

    return files
}

function cleanChangedComponents(
    destDir: string,
    changedFiles: string[],
    sourceModules: string[]
): void {
    changedFiles.forEach(sourceFile => {
        // Find which module this file belongs to
        const sourceModule = sourceModules.find(module => sourceFile.startsWith(module))
        if (!sourceModule) return

        // Calculate relative path within the module
        const relativePath = path.relative(sourceModule, sourceFile)

        // Remove .lite from the filename
        const outputPath = relativePath.replace(/\.lite\.(tsx?|jsx?)$/, '.$1')

        // Full path to generated file
        const generatedFile = path.join(destDir, sourceModule, outputPath)

        // Remove the generated file if it exists
        try {
            if (fs.existsSync(generatedFile)) {
                fs.unlinkSync(generatedFile)
            }
        } catch {
            // Ignore deletion errors
        }
    })
}

function generateConfig(skyAppConfig: Sky.App, specificFiles?: string[]): void {
    if (skyAppConfig.mitosis == null) {
        throw Error('no mitosis in app config')
    }

    const pluginsPath = path.resolve(cliPath + '/mitosis')

    // Use specific files if provided, otherwise use all module patterns
    const files =
        specificFiles && specificFiles.length > 0
            ? specificFiles.map(file => `'${file}'`).join(', ')
            : skyAppConfig.mitosis.map(module => `'${module}/**/*.lite.*'`).join(', ')

    fs.mkdirSync(`.dev/mitosis/${skyAppConfig.id}`, { recursive: true })
    fs.writeFileSync(
        `.dev/mitosis/${skyAppConfig.id}/mitosis.config.js`,
        `
            import { localVarsPlugin } from '${pluginsPath}/local-vars-plugin.ts'

            export default {
                files: [${files}],
                exclude: ['**/global.ts', '**/global.tsx', '**/*.global.ts', '**/*.global.tsx'],
                targets: ['react'],
                dest: '${`${skyAppConfig.path}/x`}',
                extensions: ['.lite.ts', '.lite.tsx'],
                getTargetPath(opts) {
                    return '.'
                },
                commonOptions: {
                    typescript: true,
                    explicitImportFileExtension: false,
                    useProxy: false,
                    prettier: false, // Disable prettier to allow plugins to run
                    plugins: [
                        localVarsPlugin()
                    ],
                },
            }
        `
    )
}

function post(targetPath: string, skyAppConfig: Sky.App): void {
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

    // Post-process hooks for framework compatibility
    const hookProcessor = new HookPostProcessor({ enabled: true })
    hookProcessor.processHooks(targetPath)

    // Copy .lite.css files from source modules
    if (skyAppConfig.mitosis) {
        skyAppConfig.mitosis.forEach(modulePath => {
            try {
                const cssFiles = findCssFilesRecursive(modulePath)

                cssFiles.forEach(filePath => {
                    const relativePath = path.relative(modulePath, filePath)
                    const targetFile = relativePath
                    const targetFilePath = path.join(targetPath, modulePath, targetFile)

                    // Create directory structure if it doesn't exist
                    const targetDir = path.dirname(targetFilePath)

                    if (!fs.existsSync(targetDir)) {
                        fs.mkdirSync(targetDir, { recursive: true })
                    }

                    try {
                        fs.copyFileSync(filePath, targetFilePath)
                        Console.log(`📄 Copied CSS: ${filePath} → ${targetFilePath}`)
                    } catch (error) {
                        Console.error(`❌ Failed to copy CSS file ${relativePath}: ${error}`)
                    }
                })
            } catch (error) {
                Console.error(`❌ Failed to read module directory ${modulePath}: ${error}`)
            }
        })
    }
}

function findCssFilesRecursive(dir: string): string[] {
    const cssFiles: string[] = []

    function searchDirectory(currentDir: string): void {
        try {
            const items = fs.readdirSync(currentDir, { withFileTypes: true })

            for (const item of items) {
                const fullPath = path.join(currentDir, item.name)

                if (item.isDirectory()) {
                    searchDirectory(fullPath)
                } else if (item.isFile() && item.name.endsWith('.lite.css')) {
                    cssFiles.push(fullPath)
                }
            }
        } catch (error) {
            Console.error(`❌ Failed to read directory ${currentDir}: ${error}`)
        }
    }

    searchDirectory(dir)
    return cssFiles
}
