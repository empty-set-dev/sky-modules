import { existsSync, writeFileSync, watchFile, unwatchFile, mkdirSync } from 'fs'
import { resolve, dirname, join } from 'path'

import { ArgumentsCamelCase } from 'yargs'

import Console from './utilities/Console'
import generateBrandCss from './utilities/generateBrandCssVariables'
import { loadAppCofig } from './utilities/loadSkyConfig'
import { resolveBrandInheritance } from './utilities/resolveBrandInheritance'

interface BrandBuildArgs {
    appName: string
    input: string
    output: string
    minify: boolean
    watch: boolean
    all?: boolean
}

export default async function brandBuild(argv: ArgumentsCamelCase<BrandBuildArgs>): Promise<void> {
    const { appName, input, output, minify, watch, all } = argv

    Console.info(`🏗️ Building brand CSS for ${appName}`)

    // Load app config to get correct paths
    const appConfigResult = await loadAppCofig(appName)

    if (!appConfigResult) {
        Console.error(`Failed to load app config for ${appName}`)
        process.exit(1)
    }

    const [skyAppConfig] = appConfigResult

    // Discover all brand files
    async function discoverBrandFiles(): Promise<string[]> {
        const { readdirSync } = await import('fs')

        const brandFiles: string[] = []

        // Check for standard brand.ts in app path
        if (existsSync(join(skyAppConfig.path, 'brand.ts'))) {
            brandFiles.push(join(skyAppConfig.path, 'brand.ts'))
        }

        if (existsSync(join(skyAppConfig.path, 'brand.js'))) {
            brandFiles.push(join(skyAppConfig.path, 'brand.js'))
        }

        // Find framework brand files recursively
        try {
            function findBrandFilesRecursively(dir: string): string[] {
                const results: string[] = []
                const items = readdirSync(dir, { withFileTypes: true })

                for (const item of items) {
                    const fullPath = join(dir, item.name)

                    if (item.isDirectory()) {
                        // Recursively search subdirectories
                        results.push(...findBrandFilesRecursively(fullPath))
                    } else if (item.isFile() && item.name.endsWith('.brand.ts')) {
                        results.push(fullPath)
                    }
                }

                return results
            }

            const frameworkFiles = findBrandFilesRecursively(skyAppConfig.path)
            brandFiles.push(...frameworkFiles)
        } catch {
            // Ignore read errors
        }

        return brandFiles // Remove duplicates
    }

    async function buildSingleBrand(brandPath: string): Promise<void> {
        try {
            if (!existsSync(brandPath)) {
                Console.error(`Brand configuration file not found: ${brandPath}`)
                return
            }

            // Import brand configuration
            Console.info(`Loading brand configuration from: ${brandPath}`)

            // Import with cache busting for watch mode
            const brandModule = await import(resolve(brandPath))
            const brand = brandModule.default ?? brandModule[`${appName}Brand`] ?? brandModule

            if (!brand) {
                Console.error('No brand configuration found in the input file')
                return
            }

            // Resolve brand inheritance
            Console.info('Resolving brand inheritance...')
            const resolvedBrand = await resolveBrandInheritance(brand, brandPath)

            // Generate CSS variables
            Console.info('Generating CSS variables...')

            // Use resolvedBrand.name or extract from file path
            let brandName = resolvedBrand.name || ''

            if (!brandName) {
                const fileName = brandPath.split('/').pop()!

                if (fileName.includes('.brand.ts')) {
                    brandName = fileName.replace('.brand.ts', '')

                    // Don't set brandName for reset (default brand)
                    if (brandName === 'reset') {
                        brandName = ''
                    }
                }
            }

            // Generate CSS with new unified function
            const result = generateBrandCss(resolvedBrand, {
                includeComments: !minify,
                minify,
                brandName,
                generateUtilities: true,
            })

            // Determine output path
            let outputPath: string

            if (output !== 'Auto-generate based on input file') {
                outputPath = resolve(output)
            } else {
                // Auto-generate CSS filename based on input file
                let inputFileName = brandPath.split('/').pop()!

                if (inputFileName.endsWith('.brand.ts')) {
                    inputFileName = inputFileName.replace('.brand.ts', '.brand.css')
                } else if (inputFileName.endsWith('brand.ts')) {
                    inputFileName = inputFileName.replace('brand.ts', 'brand.css')
                } else {
                    inputFileName = inputFileName.replace('.ts', '.css')
                }

                outputPath = resolve(skyAppConfig.path, inputFileName)
            }

            // Ensure output directory exists
            const outputDir = dirname(outputPath)

            if (!existsSync(outputDir)) {
                mkdirSync(outputDir, { recursive: true })
            }

            writeFileSync(outputPath, result.css)

            // Log results
            Console.success(`✨ Brand CSS generated: ${outputPath}`)
            Console.info(`📊 Statistics:`)
            Console.info(`  • Variables: ${result.stats.variableCount}`)
            Console.info(`  • Utilities: ${result.stats.utilityCount}`)
            Console.info(`  • Size: ${result.stats.bytes} bytes`)
        } catch (error) {
            Console.error(`Failed to build brand CSS from ${brandPath}: ${error}`)

            if (!watch) {
                throw error
            }
        }
    }

    async function buildBrand(): Promise<void> {
        try {
            // Default to building all brands unless specific input is provided
            const shouldBuildAll =
                all !== false && (input === 'Auto-detect *.brand.ts in app path' || all === true)

            if (shouldBuildAll) {
                // Build all discovered brand files
                const brandFiles = await discoverBrandFiles()

                if (brandFiles.length === 0) {
                    Console.error(`No brand files found in: ${skyAppConfig.path}`)
                    Console.info(`Run: sky brand init ${appName}`)
                    process.exit(1)
                }

                Console.info(`🎨 Building ${brandFiles.length} brand(s)...`)

                for (const brandFile of brandFiles) {
                    const brandName = brandFile
                        .split('/')
                        .pop()!
                        .replace(/\.brand\.ts$/, '')
                        .replace(/\.ts$/, '')

                    Console.info(`\n🎯 Building ${brandName} brand...`)
                    await buildSingleBrand(brandFile)
                }

                Console.success(`\n🎉 Successfully built ${brandFiles.length} brand(s)!`)
            } else {
                // Build single specified file
                const inputPath = resolve(input)
                await buildSingleBrand(inputPath)
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
