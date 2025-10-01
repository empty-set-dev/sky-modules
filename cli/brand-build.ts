import { existsSync, writeFileSync, watchFile, unwatchFile } from 'fs'
import { resolve, dirname } from 'path'

import { ArgumentsCamelCase } from 'yargs'

import Console from './utilities/Console'
import generateBrandCssVariables from './utilities/generateBrandCssVariables'
import { loadAppCofig } from './utilities/loadSkyConfig'

interface BrandBuildArgs {
    appName: string
    input: string
    output: string
    classes: boolean
    minify: boolean
    watch: boolean
}

export default async function brandBuild(argv: ArgumentsCamelCase<BrandBuildArgs>): Promise<void> {
    const { appName, input, output, classes, minify, watch } = argv

    Console.info(`🏗️ Building brand CSS for ${appName}`)

    // Load app config to get correct paths
    const appConfigResult = await loadAppCofig(appName)

    if (!appConfigResult) {
        Console.error(`Failed to load app config for ${appName}`)
        process.exit(1)
    }

    const [skyAppConfig] = appConfigResult

    async function buildBrand(): Promise<void> {
        try {
            let inputPath: string

            if (input !== '{app-path}/{app-id}.brand.ts') {
                // Use provided input path
                inputPath = resolve(input)
            } else {
                // Search for *.brand.ts files in app path
                const { readdirSync } = await import('fs')
                const files = readdirSync(skyAppConfig.path).filter(file => {
                    Console.log(file)
                    return file.endsWith('.brand.ts')
                })

                if (files.length === 0) {
                    Console.error(`No .brand.ts files found in: ${skyAppConfig.path}`)
                    Console.info(`Run: sky brand init ${appName}`)
                    process.exit(1)
                } else if (files.length === 1) {
                    inputPath = resolve(skyAppConfig.path, files[0])
                } else {
                    Console.error(`Multiple .brand.ts files found in ${skyAppConfig.path}:`)
                    files.forEach(file => Console.info(`  • ${file}`))
                    Console.info(`Please specify which file to use with --input`)
                    process.exit(1)
                }
            }

            if (!existsSync(inputPath)) {
                Console.error(`Brand configuration file not found: ${inputPath}`)
                Console.info(`Run: sky brand init ${appName}`)
                process.exit(1)
            }

            // Import brand configuration
            Console.info(`Loading brand configuration from: ${inputPath}`)

            // Clear require cache to reload the module
            delete require.cache[require.resolve(inputPath)]

            const brandModule = await import(inputPath)
            const brand = brandModule.default || brandModule[`${appName}Brand`] || brandModule

            if (!brand) {
                Console.error('No brand configuration found in the input file')
                process.exit(1)
            }

            // Generate CSS variables
            Console.info('Generating CSS variables...')
            const result = generateBrandCssVariables(brand, {
                includeComments: !minify,
                generateClasses: classes,
                minify,
            })

            // Ensure output directory exists
            const outputDir = dirname(resolve(output))
            const { mkdirSync } = await import('fs')

            if (!existsSync(outputDir)) {
                mkdirSync(outputDir, { recursive: true })
            }

            // Determine output path: use provided output or auto-generate based on input file
            let outputPath: string

            if (output !== 'Auto-generate based on input file') {
                outputPath = resolve(output)
            } else {
                // Auto-generate CSS filename based on input file
                const inputFileName = inputPath.split('/').pop()!.replace('.brand.ts', '.brand.css')
                outputPath = resolve(skyAppConfig.path, inputFileName)
            }

            writeFileSync(outputPath, result.css)

            // Log results
            Console.success(`✨ Brand CSS generated: ${outputPath}`)
            Console.info(`📊 Statistics:`)
            Console.info(`  • Variables: ${result.stats.variableCount}`)

            if (classes && result.stats.classCount) {
                Console.info(`  • Utility classes: ${result.stats.classCount}`)
            }

            Console.info(`  • Size: ${result.stats.bytes} bytes`)

            if (classes && result.classes) {
                const classesPath = outputPath.replace('.css', '.classes.css')
                writeFileSync(classesPath, result.classes)
                Console.success(`Generated utility classes: ${classesPath}`)
            }
        } catch (error) {
            Console.error(`Failed to build brand CSS: ${error}`)

            if (!watch) {
                process.exit(1)
            }
        }
    }

    // Initial build
    await buildBrand()

    // Watch mode
    if (watch) {
        Console.info(`👁️ Watching for changes in: ${input}`)

        const inputPath = resolve(input)
        watchFile(inputPath, { interval: 1000 }, (curr, prev) => {
            if (curr.mtime !== prev.mtime) {
                Console.info('🔄 Brand configuration changed, rebuilding...')
                void buildBrand()
            }
        })

        // Keep process alive
        process.on('SIGINT', () => {
            Console.info('\n👋 Stopping watch mode...')
            unwatchFile(inputPath)
            process.exit(0)
        })

        Console.info('Press Ctrl+C to stop watching')
    }
}
