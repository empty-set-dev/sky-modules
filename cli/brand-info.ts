import { ArgumentsCamelCase } from 'yargs'
import { existsSync } from 'fs'
import { resolve } from 'path'

import Console from './utilities/Console'

interface BrandInfoArgs {
    appName: string
    input: string
    stats: boolean
}

export default async function brandInfo(
    argv: ArgumentsCamelCase<BrandInfoArgs>
): Promise<void> {
    const { appName, input, stats } = argv

    Console.info(`ℹ️ Brand information for ${appName}`)

    try {
        // Check if input file exists
        const inputPath = resolve(input)
        if (!existsSync(inputPath)) {
            Console.error(`Brand configuration file not found: ${inputPath}`)
            Console.info(`Run: sky brand init ${appName}`)
            process.exit(1)
        }

        // Import brand configuration
        const brandModule = await import(inputPath)
        const brand = brandModule.default || brandModule[`${appName}Brand`] || brandModule

        if (!brand) {
            Console.error('No brand configuration found in the input file')
            process.exit(1)
        }

        // Basic information
        Console.info(`\n📄 Brand Configuration:`)
        Console.info(`  • File: ${inputPath}`)
        Console.info(`  • Mode: ${brand.global?.mode || 'unknown'}`)
        Console.info(`  • Accessibility: ${brand.global?.accessibility ? 'enabled' : 'disabled'}`)

        // Foundation stats
        if (brand.foundation) {
            Console.info(`\n🏗️ Foundation:`)

            if (brand.foundation.colors) {
                const colorCount = Object.keys(brand.foundation.colors).length
                Console.info(`  • Color scales: ${colorCount}`)

                if (stats) {
                    for (const [colorName, colorScale] of Object.entries(brand.foundation.colors)) {
                        if (typeof colorScale === 'object') {
                            const shadeCount = Object.keys(colorScale).length
                            Console.info(`    • ${colorName}: ${shadeCount} shades`)
                        }
                    }
                }
            }

            if (brand.foundation.typography) {
                Console.info(`  • Font families: ${Object.keys(brand.foundation.typography.fontFamily || {}).length}`)
                Console.info(`  • Font sizes: ${Object.keys(brand.foundation.typography.fontSize || {}).length}`)
                Console.info(`  • Font weights: ${Object.keys(brand.foundation.typography.fontWeight || {}).length}`)
            }

            if (brand.foundation.spacing) {
                Console.info(`  • Spacing scale: ${Object.keys(brand.foundation.spacing).length} values`)
            }

            if (brand.foundation.screens) {
                Console.info(`  • Breakpoints: ${Object.keys(brand.foundation.screens).length}`)
                if (stats) {
                    for (const [name, value] of Object.entries(brand.foundation.screens)) {
                        Console.info(`    • ${name}: ${value}`)
                    }
                }
            }
        }

        // Semantic stats
        if (brand.semantic) {
            Console.info(`\n🎨 Semantic:`)

            if (brand.semantic.colors) {
                const colorGroups = Object.keys(brand.semantic.colors).length
                Console.info(`  • Color groups: ${colorGroups}`)

                if (stats) {
                    for (const [groupName, colors] of Object.entries(brand.semantic.colors)) {
                        if (typeof colors === 'object') {
                            const colorCount = Object.keys(colors).length
                            Console.info(`    • ${groupName}: ${colorCount} colors`)
                        }
                    }
                }
            }

            if (brand.semantic.spacing) {
                Console.info(`  • Semantic spacing: ${Object.keys(brand.semantic.spacing).length} values`)
            }

            if (brand.semantic.sizing) {
                Console.info(`  • Semantic sizing: ${Object.keys(brand.semantic.sizing).length} values`)
            }
        }

        // Component stats
        if (brand.components) {
            const componentCount = Object.keys(brand.components).length
            Console.info(`\n🎭 Components: ${componentCount}`)

            if (stats && componentCount > 0) {
                for (const componentName of Object.keys(brand.components)) {
                    Console.info(`  • ${componentName}`)
                }
            }
        }

        // Global settings
        if (brand.global) {
            Console.info(`\n🌍 Global Settings:`)
            Console.info(`  • Mode: ${brand.global.mode}`)
            Console.info(`  • Direction: ${brand.global.i18n?.direction || 'ltr'}`)
            Console.info(`  • Locale: ${brand.global.i18n?.locale || 'en-US'}`)
            Console.info(`  • Tone: ${brand.global.content?.tone || 'professional'}`)

            if (brand.global.accessibility) {
                Console.info(`  • Reduced motion: ${brand.global.accessibility.reducedMotion ? 'enabled' : 'disabled'}`)
                Console.info(`  • High contrast: ${brand.global.accessibility.highContrast ? 'enabled' : 'disabled'}`)
            }
        }

        // Theme support
        if (brand.themes) {
            Console.info(`\n🌙 Theme Support:`)
            Console.info(`  • Mode: ${brand.themes.mode}`)
            Console.info(`  • Default: ${brand.themes.defaultMode}`)

            if (brand.themes.customThemes) {
                Console.info(`  • Custom themes: ${brand.themes.customThemes.length}`)
                if (stats) {
                    for (const theme of brand.themes.customThemes) {
                        Console.info(`    • ${theme}`)
                    }
                }
            }
        }

        // Generate CSS for stats
        if (stats) {
            Console.info(`\n📊 CSS Generation Preview:`)
            const { generateBrandCssVariables } = await import('./utilities/generateBrandCssVariables')

            const result = generateBrandCssVariables(brand, {
                includeComments: false,
                generateClasses: false,
                minify: true,
            })

            Console.info(`  • CSS variables: ${result.stats.variableCount}`)
            Console.info(`  • Minified size: ${result.stats.bytes} bytes`)

            const withClasses = generateBrandCssVariables(brand, {
                includeComments: false,
                generateClasses: true,
                minify: true,
            })

            if (withClasses.stats.classCount) {
                Console.info(`  • With utility classes: ${withClasses.stats.classCount} classes`)
                Console.info(`  • Total size with classes: ${withClasses.stats.bytes} bytes`)
            }
        }

        Console.success(`\n✨ Brand information displayed successfully!`)

    } catch (error) {
        Console.error(`Failed to get brand information: ${error}`)
        process.exit(1)
    }
}