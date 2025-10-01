import { existsSync, writeFileSync, watchFile, unwatchFile } from 'fs'
import { resolve, dirname } from 'path'

import { ArgumentsCamelCase } from 'yargs'

import Console from './utilities/Console'
import { generateBrandCssVariables } from './utilities/generateBrandCssVariables'

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

    async function buildBrand(): Promise<void> {
        try {
            // Check if input file exists
            const inputPath = resolve(input)

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

            // Write CSS file
            const outputPath = resolve(output)
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
