import { ChildProcess, spawn } from 'child_process'
import fs from 'fs'
import path from 'path'

import { Argv } from 'yargs'

import { CLI_CONSTANTS } from './constants'
import { MitosisCache } from './mitosis/cache'
import { HookPostProcessor } from './mitosis/hook-post-processor'
import { MitosisProgressTracker } from './mitosis/MitosisProgressTracker'
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

                    // Initialize cache and prepare config
                    const cache = new MitosisCache(`.dev/mitosis/${skyAppConfig.id}`)
                    const allLiteFiles = getAllLiteFiles(skyAppConfig.mitosis || [])
                    const allCssFiles = getAllCssFiles(skyAppConfig.mitosis || [])

                    // Generate config with all files initially (will be updated on each rebuild)
                    generateConfig(skyAppConfig)
                    const configPath = path.resolve(
                        `.dev/mitosis/${skyAppConfig.id}/mitosis.config.js`
                    )
                    const config = (await import(configPath)).default

                    // Ensure destination directory exists
                    if (!fs.existsSync(config.dest)) {
                        fs.mkdirSync(config.dest, { recursive: true })
                    }

                    // Initial clean of changed components only
                    const changedFiles = cache.getChangedFiles(allLiteFiles)

                    if (changedFiles.length > 0) {
                        cleanChangedComponents(
                            config.dest,
                            changedFiles,
                            skyAppConfig.mitosis || []
                        )
                        Console.log(`🧹 Cleaned ${changedFiles.length} changed components`)
                    }

                    Console.log('👀 Starting watch mode...')

                    let mitosisProcess: ChildProcess
                    let debounceTimer: NodeJS.Timeout

                    if (skyAppConfig.mitosis == null) {
                        throw Error(`no mitosis in ${skyAppConfig.id} app config`)
                    }

                    const debouncedRunBuild = (): void => {
                        clearTimeout(debounceTimer)
                        debounceTimer = setTimeout(() => {
                            Console.clear()
                            Console.log('Build...')
                            runBuild()
                        }, CLI_CONSTANTS.MITOSIS_DEBOUNCE_MS)
                    }

                    for (const module of skyAppConfig.mitosis) {
                        fs.watch(module, { recursive: true }, debouncedRunBuild)
                    }

                    Console.clear()
                    Console.log('Build...')
                    runBuild()

                    function runBuild(): void {
                        if (!skyAppConfig) return

                        const buildStartTime = Date.now()
                        mitosisProcess && mitosisProcess.kill('SIGINT')
                        spawn('pkill', ['-f', '"mitosis build"'])

                        // Clean only changed components before rebuild
                        const changedFiles = cache.getChangedFiles(allLiteFiles)
                        const changedCssFiles = cache.getChangedFiles(allCssFiles)

                        // If nothing changed, skip build
                        if (changedFiles.length === 0 && changedCssFiles.length === 0) {
                            Console.log('✅ No changes detected, skipping build')
                            return
                        }

                        // If only CSS changed, skip Mitosis build and just copy CSS
                        if (changedFiles.length === 0 && changedCssFiles.length > 0) {
                            Console.log(
                                `📄 Only CSS files changed (${changedCssFiles.length} files)`
                            )
                            post(config.dest, skyAppConfig, cache, allCssFiles)
                            const buildEndTime = Date.now()
                            const buildDuration = ((buildEndTime - buildStartTime) / 1000).toFixed(
                                2
                            )

                            Console.log(`✅ CSS copied in ${buildDuration}s`)
                            return
                        }

                        // Clean and regenerate config for changed files
                        if (changedFiles.length > 0) {
                            cleanChangedComponents(
                                config.dest,
                                changedFiles,
                                skyAppConfig.mitosis || []
                            )
                            // Regenerate config with only changed files
                            generateConfig(skyAppConfig, changedFiles)
                        }

                        // Show spinner during build
                        const componentCount =
                            changedFiles.length > 0 ? changedFiles.length : allLiteFiles.length
                        const progressTracker = new MitosisProgressTracker(
                            componentCount,
                            allLiteFiles.length,
                            skyAppConfig.id
                        )
                        progressTracker.startSpinner()

                        mitosisProcess = spawn(
                            'npx',
                            ['mitosis', 'build', `--config=${configPath}`],
                            {
                                stdio: 'inherit',
                                shell: true,
                            }
                        )

                        // Forward stderr
                        mitosisProcess.stderr?.on('data', data => {
                            Console.error(data.toString())
                        })

                        mitosisProcess.on('close', code => {
                            progressTracker.complete()

                            if (code === 0) {
                                if (skyAppConfig) {
                                    post(config.dest, skyAppConfig, cache, allCssFiles)
                                }

                                // Update cache after successful build
                                allLiteFiles.forEach(file => cache.markFileProcessed(file))

                                const buildEndTime = Date.now()
                                const buildDuration = (
                                    (buildEndTime - buildStartTime) /
                                    1000
                                ).toFixed(2)
                                Console.log(`✅ Build completed in ${buildDuration}s`)
                            } else {
                                Console.error(`❌ Build failed with code ${code}`)
                            }
                        })

                        mitosisProcess.on('error', error => {
                            progressTracker.clear()
                            Console.error(`❌ Mitosis process failed: ${error}`)
                        })

                        process.on('SIGINT', () => {
                            progressTracker.clear()
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
                    const allCssFiles = getAllCssFiles(skyAppConfig.mitosis || [])

                    let filesToBuild: string[]

                    if (argv.force) {
                        Console.log('🔄 Force rebuild requested, ignoring cache')
                        cache.clearCache()
                        filesToBuild = allLiteFiles
                    } else {
                        const changedFiles = cache.getChangedFiles(allLiteFiles)
                        const changedCssFiles = cache.getChangedFiles(allCssFiles)

                        // If only CSS files changed, skip Mitosis build and just copy CSS
                        if (changedFiles.length === 0 && changedCssFiles.length > 0) {
                            Console.log(
                                `📄 Only CSS files changed (${changedCssFiles.length} files), copying...`
                            )
                            const configPath = path.resolve(
                                `.dev/mitosis/${skyAppConfig.id}/mitosis.config.js`
                            )
                            const config = (await import(configPath)).default
                            post(config.dest, skyAppConfig, cache, allCssFiles)
                            const duration = ((Date.now() - startTime) / 1000).toFixed(2)
                            Console.log(`✅ CSS copied in ${duration}s`)
                            return
                        }

                        if (changedFiles.length === 0) {
                            Console.log('✅ No files changed, skipping build')
                            return
                        }

                        Console.log(
                            `📁 Found ${changedFiles.length} changed files out of ${allLiteFiles.length} total`
                        )
                        filesToBuild = changedFiles
                    }

                    // Generate config with specific files to build
                    generateConfig(skyAppConfig, filesToBuild)
                    const configPath = path.resolve(
                        `.dev/mitosis/${skyAppConfig.id}/mitosis.config.js`
                    )
                    const config = (await import(configPath)).default

                    // Ensure destination directory exists
                    if (!fs.existsSync(config.dest)) {
                        fs.mkdirSync(config.dest, { recursive: true })
                    }

                    // Clean only files that will be rebuilt
                    if (filesToBuild.length > 0) {
                        cleanChangedComponents(
                            config.dest,
                            filesToBuild,
                            skyAppConfig.mitosis || []
                        )
                        Console.log(`🧹 Cleaned ${filesToBuild.length} components`)
                    }

                    // Show spinner during build
                    const componentCount = filesToBuild.length
                    const progressTracker = new MitosisProgressTracker(
                        componentCount,
                        allLiteFiles.length,
                        skyAppConfig.id
                    )
                    progressTracker.startSpinner()

                    const mitosisProcess = spawn(
                        'npx',
                        ['mitosis', 'build', `--config=${configPath}`],
                        {
                            stdio: 'inherit',
                            shell: true,
                        }
                    )

                    // Forward stderr
                    mitosisProcess.stderr?.on('data', data => {
                        Console.error(data.toString())
                    })

                    mitosisProcess.on('error', error => {
                        progressTracker.clear()
                        Console.error(`❌ Mitosis build failed: ${error}`)
                    })

                    mitosisProcess.on('close', code => {
                        progressTracker.complete()

                        if (skyAppConfig) {
                            post(config.dest, skyAppConfig, cache, allCssFiles)
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
                        progressTracker.clear()
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

function getAllCssFiles(directories: string[]): string[] {
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
                    if (entry.name.endsWith('.lite.css')) {
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
    let filesArray: string[]

    if (specificFiles && specificFiles.length > 0) {
        // For each changed file, create a pattern for its directory
        const uniqueDirs = new Set<string>()
        specificFiles.forEach(file => {
            const dir = path.dirname(file)
            uniqueDirs.add(`${dir}/**/*.lite.*`)
        })
        filesArray = Array.from(uniqueDirs)
    } else {
        filesArray = skyAppConfig.mitosis.map(module => `${module}/**/*.lite.*`)
    }

    fs.mkdirSync(`.dev/mitosis/${skyAppConfig.id}`, { recursive: true })

    // Generate proper JavaScript array syntax
    const filesJson = JSON.stringify(filesArray, null, 4)

    fs.writeFileSync(
        `.dev/mitosis/${skyAppConfig.id}/mitosis.config.js`,
        `
            import { localVarsPlugin } from '${pluginsPath}/local-vars-plugin.ts'

            export default {
                files: ${filesJson},
                exclude: ['**/global.ts', '**/global.tsx', '**/*.global.ts', '**/*.global.tsx'],
                targets: ['${skyAppConfig.jsx === 'sky' ? 'solid' : skyAppConfig.jsx}'],
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

function post(
    targetPath: string,
    skyAppConfig: Sky.App,
    cache: MitosisCache,
    allCssFiles: string[]
): void {
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

    // Copy only changed .lite.css files from source modules
    if (skyAppConfig.mitosis) {
        const changedCssFiles = cache.getChangedFiles(allCssFiles)

        if (changedCssFiles.length > 0) {
            changedCssFiles.forEach(filePath => {
                // Find which module this file belongs to
                const sourceModule = skyAppConfig.mitosis?.find(module =>
                    filePath.startsWith(module)
                )

                if (!sourceModule) return

                const relativePath = path.relative(sourceModule, filePath)
                const targetFilePath = path.join(targetPath, sourceModule, relativePath)

                // Create directory structure if it doesn't exist
                const targetDir = path.dirname(targetFilePath)

                if (!fs.existsSync(targetDir)) {
                    fs.mkdirSync(targetDir, { recursive: true })
                }

                try {
                    fs.copyFileSync(filePath, targetFilePath)
                    Console.log(`📄 Copied CSS: ${relativePath}`)
                } catch (error) {
                    Console.error(`❌ Failed to copy CSS file ${relativePath}: ${error}`)
                }
            })

            // Mark CSS files as processed
            changedCssFiles.forEach(file => cache.markFileProcessed(file))

            Console.log(`📦 Copied ${changedCssFiles.length} CSS files`)
        }
    }
}
