import { ArgumentsCamelCase } from 'yargs'
import { existsSync, mkdirSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'

import Console from './utilities/Console'

interface BrandInitArgs {
    appName: string
    template: 'reset' | 'sky' | 'custom'
    output: string
    css: boolean
}

export default async function brandInit(
    argv: ArgumentsCamelCase<BrandInitArgs>
): Promise<void> {
    const { appName, template, output, css } = argv

    Console.info(`🎨 Initializing brand system for ${appName}`)

    try {
        // Create output directory
        if (!existsSync(output)) {
            mkdirSync(output, { recursive: true })
            Console.success(`Created directory: ${output}`)
        }

        // Generate brand configuration file
        const brandConfigPath = join(output, 'brand.ts')
        let brandConfig = ''

        switch (template) {
            case 'reset':
                brandConfig = `// 🎨 Brand Configuration for ${appName}
import type Brand from '@sky-modules/design/Brand'
import { resetBrand } from '@sky-modules/design/brands/reset.brand'

// Customize your brand by extending the reset brand
export const ${appName}Brand: Brand = {
    ...resetBrand,
    // Override foundation tokens
    foundation: {
        ...resetBrand.foundation,
        colors: {
            ...resetBrand.foundation.colors,
            brand: {
                ...resetBrand.foundation.colors.brand,
                500: '#3b82f6', // Customize primary brand color
            },
        },
    },
    // Override semantic tokens
    semantic: {
        ...resetBrand.semantic,
        colors: {
            ...resetBrand.semantic.colors,
            brand: {
                ...resetBrand.semantic.colors.brand,
                primary: '#3b82f6',
                primaryHover: '#2563eb',
                primaryActive: '#1d4ed8',
                primarySubtle: 'rgba(59, 130, 246, 0.1)',
            },
        },
    },
    // Override global settings
    global: {
        ...resetBrand.global,
        content: {
            ...resetBrand.global.content,
            microcopy: {
                ...resetBrand.global.content.microcopy,
                loading: 'Loading ${appName}...',
            },
        },
    },
}

export default ${appName}Brand`
                break

            case 'sky':
                brandConfig = `// 🎨 Brand Configuration for ${appName}
import type Brand from '@sky-modules/design/Brand'
import { cyberpunkBrand } from '@sky-modules/examples/universal/sky.brand'

// Use Sky theme as base
export const ${appName}Brand: Brand = {
    ...cyberpunkBrand,
    // Customize for your app
    global: {
        ...cyberpunkBrand.global,
        content: {
            ...cyberpunkBrand.global.content,
            microcopy: {
                ...cyberpunkBrand.global.content.microcopy,
                loading: 'Loading ${appName}...',
            },
        },
    },
}

export default ${appName}Brand`
                break

            case 'custom':
                brandConfig = `// 🎨 Custom Brand Configuration for ${appName}
import type Brand from '@sky-modules/design/Brand'

export const ${appName}Brand: Brand = {
    foundation: {
        colors: {
            // Define your color scales (50-950)
            brand: {
                50: '#eff6ff',
                100: '#dbeafe',
                200: '#bfdbfe',
                300: '#93c5fd',
                400: '#60a5fa',
                500: '#3b82f6', // Primary
                600: '#2563eb',
                700: '#1d4ed8',
                800: '#1e40af',
                900: '#1e3a8a',
                950: '#172554',
            },
            // Add more color scales as needed
            gray: {
                50: '#fafafa',
                100: '#f4f4f5',
                200: '#e4e4e7',
                300: '#d4d4d8',
                400: '#a1a1aa',
                500: '#71717a',
                600: '#52525b',
                700: '#3f3f46',
                800: '#27272a',
                900: '#18181b',
                950: '#09090b',
            },
            // TODO: Add other color scales
        },
        typography: {
            fontFamily: {
                sans: ['system-ui', 'sans-serif'],
                serif: ['Georgia', 'serif'],
                mono: ['ui-monospace', 'monospace'],
                display: ['system-ui', 'sans-serif'],
            },
            fontSize: {
                xs: ['0.75rem', { lineHeight: '1rem' }],
                sm: ['0.875rem', { lineHeight: '1.25rem' }],
                base: ['1rem', { lineHeight: '1.5rem' }],
                lg: ['1.125rem', { lineHeight: '1.75rem' }],
                xl: ['1.25rem', { lineHeight: '1.875rem' }],
                '2xl': ['1.5rem', { lineHeight: '2rem' }],
                '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
                '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
                '5xl': ['3rem', { lineHeight: '3rem' }],
                '6xl': ['3.75rem', { lineHeight: '3.75rem' }],
                '7xl': ['4.5rem', { lineHeight: '4.5rem' }],
                '8xl': ['6rem', { lineHeight: '6rem' }],
                '9xl': ['8rem', { lineHeight: '8rem' }],
            },
            // TODO: Complete typography configuration
        },
        // TODO: Complete foundation configuration
    },
    semantic: {
        // TODO: Define semantic tokens
    },
    global: {
        mode: 'light',
        accessibility: {
            reducedMotion: false,
            highContrast: false,
            focusRing: {
                width: '2px',
                style: 'solid',
                color: '#3b82f6',
                offset: '2px',
            },
        },
        // TODO: Complete global configuration
    },
    components: {} as Brand['components'],
    charts: {} as Brand['charts'],
    animations: {} as Brand['animations'],
    layout: {} as Brand['layout'],
}

export default ${appName}Brand`
                break
        }

        writeFileSync(brandConfigPath, brandConfig)
        Console.success(`Created brand configuration: ${brandConfigPath}`)

        // Generate CSS variables if requested
        if (css) {
            const { generateBrandCssVariables } = await import('./utilities/generateBrandCssVariables')

            // Import the brand to generate CSS
            let brand
            if (template === 'reset') {
                const { resetBrand } = await import('../design/brands/reset.brand')
                brand = resetBrand
            } else if (template === 'sky') {
                const { cyberpunkBrand } = await import('../examples/universal/sky.brand')
                brand = cyberpunkBrand
            } else {
                Console.warn('CSS generation skipped for custom template. Run "sky brand build" after completing configuration.')
                return
            }

            const result = generateBrandCssVariables(brand, {
                includeComments: true,
                generateClasses: false,
                minify: false,
            })

            const cssPath = join(output, 'brand.css')
            writeFileSync(cssPath, result.css)
            Console.success(`Generated CSS variables: ${cssPath}`)
            Console.info(`Generated ${result.stats.variableCount} CSS variables (${result.stats.bytes} bytes)`)
        }

        // Generate TypeScript declarations
        const declarationsPath = join(output, 'brand.d.ts')
        const declarations = `// 🎨 Brand TypeScript Declarations for ${appName}
import type Brand from '@sky-modules/design/Brand'

declare const ${appName}Brand: Brand
export default ${appName}Brand
export { ${appName}Brand }
`
        writeFileSync(declarationsPath, declarations)
        Console.success(`Created TypeScript declarations: ${declarationsPath}`)

        // Generate usage example
        const examplePath = join(output, 'example.ts')
        const example = `// 🎨 Brand Usage Example for ${appName}
import ${appName}Brand from './brand'
import { generateBrandCssVariables } from '@sky-modules/cli/utilities/generateBrandCssVariables'

// Generate CSS variables
const result = generateBrandCssVariables(${appName}Brand, {
    includeComments: true,
    generateClasses: true, // Generate utility classes
    minify: false,
})

console.log('Generated CSS:', result.css)
console.log('Statistics:', result.stats)

// Use semantic colors in your app
const primaryColor = ${appName}Brand.semantic.colors.brand.primary
const backgroundColor = ${appName}Brand.semantic.colors.background.primary

console.log('Primary color:', primaryColor)
console.log('Background color:', backgroundColor)
`
        writeFileSync(examplePath, example)
        Console.success(`Created usage example: ${examplePath}`)

        Console.success(`\n✨ Brand system initialized for ${appName}!`)
        Console.info(`\nNext steps:`)
        Console.info(`1. Customize your brand in: ${brandConfigPath}`)
        Console.info(`2. Generate CSS: sky brand build ${appName}`)
        Console.info(`3. Validate config: sky brand validate ${appName}`)

    } catch (error) {
        Console.error(`Failed to initialize brand system: ${error}`)
        process.exit(1)
    }
}