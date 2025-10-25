import Brand from '@sky-modules/design/Brand'

import type { BrandCssGeneratorConfig, GeneratorResult } from './types'

import { camelToKebab, formatComment, sanitizeValue } from './helpers'
import { defaultConfig } from './types'
import { generateUtilityClass } from './utilities'

// Component CSS generator
export function generateComponentCss(
    components: Brand['components'],
    config: Partial<BrandCssGeneratorConfig> = {}
): GeneratorResult {
    const cfg = { ...defaultConfig, ...config }
    let css = ''
    let utilities = ''

    if (cfg.includeComments) {
        css += formatComment('🎭 Component Tokens', cfg.minify)
    }

    // Generate component variables recursively
    function generateComponentVars(componentName: string, obj: object, prefix = ''): void {
        Object.entries(obj).forEach(([key, value]) => {
            if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                generateComponentVars(componentName, value, `${prefix}${camelToKebab(key)}-`)
            } else {
                const varName = `${cfg.prefix}${camelToKebab(componentName)}-${prefix}${camelToKebab(key)}`
                css += `    ${varName}: ${sanitizeValue(value)};\n`

                // Generate utility classes for component tokens
                const utilityName = `${camelToKebab(componentName)}-${prefix}${camelToKebab(key)}`
                utilities += generateUtilityClass(varName, String(value), 'color', cfg, utilityName)
            }
        })
    }

    // Generate all component variables
    Object.entries(components || {}).forEach(([componentName, componentConfig]) => {
        if (cfg.includeComments) {
            css += formatComment(`${componentName.charAt(0).toUpperCase() + componentName.slice(1)} Component`, cfg.minify)
        }

        if (componentConfig && typeof componentConfig === 'object') {
            generateComponentVars(componentName, componentConfig)
        }
    })

    return { css, utilities }
}
