import { writeFileSync } from 'fs'
import { join } from 'path'

import Brand from 'sky/design/Brand'
import { ArgumentsCamelCase } from 'yargs'

import Console from './utilities/Console'
import { loadAppCofig } from './utilities/loadSkyConfig'
import mergeNamespace from './utilities/mergeNamespace'

interface BrandInitArgs {
    appName: string
    template: 'reset' | 'sky' | 'custom'
    css: boolean
}

export default async function brandInit(argv: ArgumentsCamelCase<BrandInitArgs>): Promise<void> {
    const { appName, template, css } = argv

    Console.info(`🎨 Initializing brand system for ${appName}`)

    // Load app config to get correct paths
    const appConfigResult = await loadAppCofig(appName)

    if (!appConfigResult) {
        Console.error(`Failed to load app config for ${appName}`)
        process.exit(1)
    }

    const [skyAppConfig] = appConfigResult

    try {
        const outputDir = skyAppConfig.path

        // Generate brand configuration file with correct name
        const brandConfigPath = join(outputDir, `brand.ts`)
        let brandConfig = ''

        switch (template) {
            case 'reset':
                brandConfig = `// 🎨 Brand Configuration for ${appName}
import resetBrand from '@sky-modules/design/brands/reset.brand'

import type { BrandDescription } from '@sky-modules/design/Brand'

// Customize your brand by extending the reset brand
export default {
    ...resetBrand,
} satisfies BrandDescription
`
                break

            case 'sky':
                brandConfig = `// 🎨 Brand Configuration for ${appName}
import skyBrand from '@sky-modules/examples/universal/sky.brand'

import type Brand from '@sky-modules/design/Brand'

// Use Sky theme as base
export default {
    ...skyBrand,
    // Customize for your app
    global: {
        ...skyBrand.global,
        content: {
            ...skyBrand.global.content,
            microcopy: {
                ...skyBrand.global.content.microcopy,
                loading: 'Loading ${appName}...',
            },
        },
    },
} satisfies BrandDescription
`
                break
        }

        writeFileSync(brandConfigPath, brandConfig)
        Console.info(`Created brand configuration: ${brandConfigPath}`)

        // Generate CSS variables if requested
        if (css) {
            const generateBrandCssVariables = (
                await import('./utilities/generateBrandCssVariables')
            ).default

            // Import the brand to generate CSS
            const resetBrand = structuredClone(
                (await import('../design/brands/reset.brand')).default
            )

            let brand: Brand = resetBrand

            if (template === 'sky') {
                const skyBrand = structuredClone(
                    (await import('../design/brands/sky.brand')).default
                )
                mergeNamespace(resetBrand, skyBrand)
            } else if (template !== 'reset') {
                Console.warn(
                    'CSS generation skipped for custom template. Run "sky brand build" after completing configuration.'
                )
                return
            }

            const result = generateBrandCssVariables(brand, {
                includeComments: true,
                generateClasses: false,
                minify: false,
            })

            const cssPath = join(skyAppConfig.path, 'brand.css')
            writeFileSync(cssPath, result.css)
            Console.info(`Generated CSS variables: ${cssPath}`)
            Console.info(
                `Generated ${result.stats.variableCount} CSS variables (${result.stats.bytes} bytes)`
            )
        }

        Console.info(`✨ Brand system initialized successfully for ${appName}!`)
    } catch (error) {
        Console.error(`Failed to initialize brand system: ${error}`)
        process.exit(1)
    }
}
