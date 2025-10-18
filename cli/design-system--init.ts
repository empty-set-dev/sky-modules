import { writeFileSync } from 'fs'
import { join } from 'path'

import { ArgumentsCamelCase } from 'yargs'

import Console from './utilities/Console'
import { loadAppCofig } from './utilities/loadSkyConfig'

interface BrandInitArgs {
    appName: string
    template: 'reset' | 'sky' | 'custom'
}

export default async function designSystemInit(argv: ArgumentsCamelCase<BrandInitArgs>): Promise<void> {
    const { appName, template } = argv

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
import reset from '@sky-modules/design/brands/reset.brand'

import type { BrandDescription } from '@sky-modules/design/Brand'

// Customize your brand by extending the reset brand
export default {
    name: 'brand',
    extends: [reset],
} satisfies BrandDescription
`
                break

            case 'sky':
                brandConfig = `// 🎨 Brand Configuration for ${appName}
import reset from '@sky-modules/design/brands/reset.brand'
import sky from '@sky-modules/design/brands/sky.brand'

import type { BrandDescription } from '@sky-modules/design/Brand'

// Customize your brand by extending the reset brand
export default {
    name: 'brand',
    extends: [reset, sky],
} satisfies BrandDescription
`
                break
        }

        writeFileSync(brandConfigPath, brandConfig)
        Console.info(`Created brand configuration: ${brandConfigPath}`)

        Console.info(`✨ Brand system initialized successfully for ${appName}!`)
    } catch (error) {
        Console.error(`Failed to initialize brand system: ${error}`)
        process.exit(1)
    }
}
