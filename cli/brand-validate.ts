import { ArgumentsCamelCase } from 'yargs'
import { existsSync } from 'fs'
import { resolve } from 'path'

import Console from './utilities/Console'

interface BrandValidateArgs {
    appName: string
    input: string
    strict: boolean
}

export default async function brandValidate(
    argv: ArgumentsCamelCase<BrandValidateArgs>
): Promise<void> {
    const { appName, input, strict } = argv

    Console.info(`🔍 Validating brand configuration for ${appName}`)

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

        Console.info('Validating brand structure...')

        let errors = 0
        let warnings = 0

        // Validate required sections
        const requiredSections = ['foundation', 'semantic', 'global', 'components', 'charts', 'animations', 'layout']

        for (const section of requiredSections) {
            if (!brand[section]) {
                Console.error(`❌ Missing required section: ${section}`)
                errors++
            }
        }

        // Validate foundation
        if (brand.foundation) {
            if (!brand.foundation.colors) {
                Console.error('❌ Missing foundation.colors')
                errors++
            } else {
                // Check for brand colors
                if (!brand.foundation.colors.brand) {
                    Console.warn('⚠️ Missing brand color scale')
                    warnings++
                }

                // Validate color scales
                const requiredShades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]
                for (const [colorName, colorScale] of Object.entries(brand.foundation.colors)) {
                    if (typeof colorScale === 'object') {
                        for (const shade of requiredShades) {
                            if (!colorScale[shade]) {
                                if (strict) {
                                    Console.error(`❌ Missing ${colorName}-${shade}`)
                                    errors++
                                } else {
                                    Console.warn(`⚠️ Missing ${colorName}-${shade}`)
                                    warnings++
                                }
                            }
                        }
                    }
                }
            }

            if (!brand.foundation.typography) {
                Console.error('❌ Missing foundation.typography')
                errors++
            }

            if (!brand.foundation.spacing) {
                Console.error('❌ Missing foundation.spacing')
                errors++
            }
        }

        // Validate semantic
        if (brand.semantic) {
            if (!brand.semantic.colors) {
                Console.error('❌ Missing semantic.colors')
                errors++
            } else {
                const requiredColorGroups = ['background', 'foreground', 'border', 'brand', 'status']
                for (const group of requiredColorGroups) {
                    if (!brand.semantic.colors[group]) {
                        Console.error(`❌ Missing semantic.colors.${group}`)
                        errors++
                    }
                }
            }
        }

        // Validate global
        if (brand.global) {
            if (!brand.global.mode) {
                Console.error('❌ Missing global.mode')
                errors++
            }

            if (!brand.global.accessibility) {
                Console.warn('⚠️ Missing global.accessibility')
                warnings++
            }
        }

        // Additional strict validation
        if (strict) {
            // Check for empty objects
            if (Object.keys(brand.components || {}).length === 0) {
                Console.warn('⚠️ Empty components configuration')
                warnings++
            }

            if (Object.keys(brand.charts || {}).length === 0) {
                Console.warn('⚠️ Empty charts configuration')
                warnings++
            }

            if (Object.keys(brand.animations || {}).length === 0) {
                Console.warn('⚠️ Empty animations configuration')
                warnings++
            }

            if (Object.keys(brand.layout || {}).length === 0) {
                Console.warn('⚠️ Empty layout configuration')
                warnings++
            }
        }

        // Results
        if (errors === 0 && warnings === 0) {
            Console.success('✅ Brand configuration is valid!')
        } else {
            Console.info(`\n📊 Validation Results:`)
            if (errors > 0) {
                Console.error(`  • Errors: ${errors}`)
            }
            if (warnings > 0) {
                Console.warn(`  • Warnings: ${warnings}`)
            }

            if (errors > 0) {
                Console.error('\n❌ Brand configuration has errors')
                process.exit(1)
            } else {
                Console.success('\n✅ Brand configuration is valid (with warnings)')
            }
        }

    } catch (error) {
        Console.error(`Failed to validate brand configuration: ${error}`)
        process.exit(1)
    }
}